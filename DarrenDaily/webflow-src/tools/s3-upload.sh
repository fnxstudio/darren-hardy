#!/usr/bin/env bash
# Upload a built file to Webflow's asset CDN using the presigned POST that
# `data_assets_tool > create_asset` returns.
#
# Why this exists: create_asset (an MCP call the agent makes) returns an
# `uploadUrl` + `uploadDetails` form. This script POSTs the file bytes to S3
# so the agent never has to hand-assemble a 12-field multipart curl.
#
# Usage:
#   1) Agent calls create_asset, saves the tool result JSON to a file, e.g. resp.json
#   2) bash s3-upload.sh resp.json path/to/dd-home.js
#
# Accepts either the raw create_asset result object, or one wrapped as
# {"result": {...}}. Exits non-zero unless S3 returns HTTP 201.

set -euo pipefail
RESP="${1:?usage: s3-upload.sh <create_asset-response.json> <file>}"
FILE="${2:?usage: s3-upload.sh <create_asset-response.json> <file>}"

UPLOAD_URL="$(node -e 'const fs=require("fs");let j=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));j=j.result||j;process.stdout.write(j.uploadUrl)' "$RESP")"

# Rebuild curl -F args from uploadDetails (key first, file appended last below).
ARGS=()
while IFS=$'\t' read -r name value; do
  [ -z "$name" ] && continue
  ARGS+=( -F "${name}=${value}" )
done < <(node -e '
  const fs=require("fs");let j=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));j=j.result||j;
  const d=j.uploadDetails;
  const order=["key","acl","bucket","xAmzAlgorithm","xAmzCredential","xAmzDate",
               "policy","xAmzSignature","successActionStatus","contentType","cacheControl"];
  const map={xAmzAlgorithm:"X-Amz-Algorithm",xAmzCredential:"X-Amz-Credential",
             xAmzDate:"X-Amz-Date",policy:"Policy",xAmzSignature:"X-Amz-Signature",
             successActionStatus:"success_action_status",contentType:"Content-Type",
             cacheControl:"Cache-Control"};
  for(const k of order){ if(d[k]!=null) console.log((map[k]||k)+"\t"+d[k]); }
' "$RESP")

CODE=$(curl -sS -w "%{http_code}" -o /dev/null -X POST "$UPLOAD_URL" "${ARGS[@]}" -F "file=@${FILE}")
echo "S3 HTTP $CODE"
[ "$CODE" = "201" ] || { echo "UPLOAD FAILED (expected 201)"; exit 1; }
echo "OK — hostedUrl:"
node -e 'const fs=require("fs");let j=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));j=j.result||j;console.log(j.hostedUrl)' "$RESP"
