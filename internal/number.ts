const nf = new Intl.NumberFormat(undefined, { numberingSystem: "arab" })
const decimal = new Set(nf.format(1.1)).difference(new Set(nf.format(1)))

function stripExtraneous(input: string) {}
