/*
  THE FOUNDER 100 · roster
  The only file to edit when a Founder is added, updated or published. See README.md.

  A Founder 100 member is anyone who reserves the $995 FOUNDER 100 tier on the pre-print checkout.
  The page shows a Founder only when publicationApproved is true.

  Fields
    id                    unique, never reused (e.g. "f-0001")
    slug                  first-last, lowercase; becomes /founder-100/first-last
    displayName           exactly as approved for print
    sortName              optional; the gallery sorts by this (defaults to the last word of displayName)
    portraitUrl           approved headshot, 4:5, at least 960x1200
    company               organization, as approved
    title                 optional professional title
    biography             optional, short, approved text only
    founderNumber         internal administration only; never shown on the page
    publicProfileEnabled  true = the portrait opens a profile with its own shareable link
    publicationApproved   true = shown on the page; false = counted as a position, not shown

  positionsTaken
    The number of FOUNDER 100 orders. Leave it null and the page counts every entry below
    (approved or not). Set a number when orders run ahead of the entries here.
*/
window.FOUNDER_100 = {
  positionsTaken: null,
  founders: [
    /* Example (copy, fill in, remove the comment marks):
    {
      id: "f-0001",
      slug: "first-last",
      displayName: "First Last",
      portraitUrl: "portraits/first-last.webp",
      company: "Company Name",
      title: "Founder & CEO",
      biography: "",
      founderNumber: 1,
      publicProfileEnabled: true,
      publicationApproved: false
    },
    */
  ]
};
