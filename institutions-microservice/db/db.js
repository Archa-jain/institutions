const fs = require('fs');
const { FILE_PATH } = require('../constant');

const inMemDB = () => {
    let db = [];
    const connect = () => {
        if (fs.existsSync(FILE_PATH)) {
            try {
                db = JSON.parse(fs.readFileSync(FILE_PATH).toString());
            } catch (x) {
                console.error("failed to read from file")
                throw x;
            }
        }
    }

    const find = (filter) => {
        let filteredResult = [...db];
        if (filter) {
            const filters = Object.keys(filter);
            for( let i = 0; i < filters.length; i++) {
                filteredResult = db.filter( institution => institution[filters[i]] === filter[filters[i]]);
            }
        }
        return Promise.resolve(filteredResult)
    }

    const findIndex = (id) => db.findIndex(institution => institution.id === id);

    const save = async () => {
        try {
            const data = JSON.stringify(db, null, 2)
            fs.writeFileSync(FILE_PATH, data);
        } catch (x) {
            console.error("Failed to write to file")
            throw x;
        }
    }

    const update = async (id, updatedBody) => {
        const institution = await find({ id });
        const index = findIndex(id);
        const newInstitute = {...institution[0], ...updatedBody} 
        db.splice(index, 1, newInstitute);
        await save();
        return newInstitute;
    }

    const create = async (obj) => {
        
        db.push(obj)
        await save()
    }

    const deleteOne = async (id) => {
        const index = findIndex(id);
        db.splice(index, 1)
        await save()
    }
    
    return {
        connect,
        find,
        update,
        create,
        deleteOne,
    }
}

module.exports = inMemDB()