const express = require('express');
const institutionService = require('../service/institution-service')
const router = express.Router();

router.get('/', async (req, res) => {
    const data = await institutionService.getInstitutions()
    res.status(200).json(data);
});

router.post('/', async (req, res) => {
    const reqBody = req.body;
    try {
        const newInstitute = await institutionService.postInstitution(reqBody)
        res.status(201).json(newInstitute);
    } catch (err) {
        console.error(err)
        if (err === 400) {
            res.status(400).json("Invalid request body");
        } 
        else {
            res.status(500).json("Internal server error");
        }
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const reqBody = req.body;
    try {
        const newInstitute = await institutionService.putInstitution(id, reqBody)
        res.status(200).json(newInstitute);
    } catch (err) {
        if (err === 400) {
            res.status(400).json("Invalid request body");
        } else if (err === 404) {
            res.status(404).json("Not found");
        } else {
         res.status(500).json("Internal server error");
        }
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await institutionService.deleteInstitution(id)
        res.status(204).send();
    } catch (err) {
        if (err === 404) {
            res.status(404).json("Not found");
        }
        else {
            res.status(500).json("Internal server error");
        }
    }
});

module.exports = router;