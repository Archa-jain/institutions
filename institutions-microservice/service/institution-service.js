const pick = require('lodash/pick')
const  difference = require('lodash/difference')
const {v4: uuidv4} = require('uuid');
const inMemDB = require('../db/db') 
const { REQUIRED_FIELDS, Institution } = require('../models/institution')

const getInstitutions = async () => {
    return inMemDB.find();
}

const postInstitution = async (body) => {
    const postBody = pick(body, REQUIRED_FIELDS)
    if (difference(REQUIRED_FIELDS, Object.keys(postBody)).length !== 0 ) {
        throw 400;
    }
    const institution = new Institution(postBody)
    institution.id = uuidv4();
    try {
        await inMemDB.create(institution)
    } catch (err) {
        console.error(err)
        throw 500;
    }
    
    return institution;
}

const putInstitution = async (id, updatedbody) => {
    const putBody = pick(updatedbody, REQUIRED_FIELDS)
    if (Object.keys(putBody).length === 0) {
        throw 400;
    }
    const institution = await inMemDB.find({ id });
    if (institution.length === 0) {
        throw 404;
    }
    const changedBody = new Institution(putBody);
    try {
        const newInstitute = await inMemDB.update(id, changedBody);
        return newInstitute;
    } catch (err) {
        console.error(err)
        throw 500;
    }
}

const deleteInstitution = async (id) => {
    const institution = await inMemDB.find({ id });
    if (institution.length === 0) {
        throw 404;
    }
    try {
        await inMemDB.deleteOne(id);
    } catch (err) {
        console.error(err)
        throw 500;
    }
}

module.exports = {
    getInstitutions,
    postInstitution,
    putInstitution,
    deleteInstitution
}