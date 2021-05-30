export function getTextForSynopsis(str) {
  const step1 = /(\(שם\)|''|\(.*?,.*?\)|<.*?>|\|.*?\||[.+:?!"{},])/g
  const step2 = /[-]/g
  const step3 = /\s+/g
  return str
    ? str.replace(step1, "").replace(step2, " ").replace(step3, " ").trim()
    : ""
}
export function clearPunctutationFromText(str) {
  const step1 = /(''|\|.*?\||[.+:?!"{},])/g
  const step2 = /[-]/g
  const step3 = /\s+/g
  return str
    ? str.replace(step1, "").replace(step2, " ").replace(step3, " ").trim()
    : ""
}

export function hideSourceFromText(str) {
  const step1 = /(\(שם\)|\(.+,.+\)|''|\(.*?,.*?\)|<.*?,.*?>)/g
  return str
    ? str.replace(step1, "").trim()
    : ""
}

export const synopsisMap = new Map([
  [
    "leiden",
    {
      title: "ל",
    },
  ],
  [
    "dfus_rishon",
    {
      title: "ד",
    },
  ],
  [
    "kricha_2",
    {
      title: "כ2",
    },
  ],
])
