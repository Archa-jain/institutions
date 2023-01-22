const REQUIRED_FIELDS = ['name', 'city', 'province', 'sector', 'legalStatus']
class Institution {
    constructor(data) {
        REQUIRED_FIELDS.forEach(property => {
            if (data && data[property]) {
                this[property] = `${data[property]}`
            }
        })
        // this.name = `${data?.name || ''}`
        // this.city = `${data?.city || ''}`
        // this.province = `${data?.city || ''}`
        // this.sector = `${data?.sector || ''}`
        // this.legalStatus = `${data?.legalStatus || ''}`
    }
}

module.exports = { 
    Institution,
    REQUIRED_FIELDS,
}