const express = require('express');
const marked = require('marked');
const Gun = require('gun');
const TerminalRenderer = require('marked-terminal');

const PORT = process.env.PORT || 3000

marked.setOptions({
    renderer: new TerminalRenderer()
})

const app = express();
const gun = Gun({ web: app });

app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).send({ msg: "Welcome to Gunpoint API !" })
})

app.get('/get/:key', (req, res) => {
    
    const { key } = req.params;
    
    let toFetch = gun.get(key);
    toFetch.once((data) => { res.status(200).send({ data:data }) })
});

app.post('/put/:key', (req, res) => {

    const { key } = req.params;
    const dataToAdd = req.body;

    if (!dataToAdd) {
        console.log("No data !");
        res.status(418).send({ error: "There's no data in your request !" })
    } else {
        let toFetch = gun.get(key);
        let dataFetched;
    
        toFetch.put(dataToAdd)
        toFetch.once((data) => { res.status(200).send({ success: "Ouuuya ! The data has been added !", dataAdded:dataToAdd, currentContent: data }) })
    }
})

app.post('/put/:key/in/:key2', (req, res) => {
    const toSetIn = req.params.key;
    const where = req.params.key2;

    gun.get(where).set(toSetIn);
    res.status(200).send({ success: `${toSetIn} has been successfully put in ${where} !` })
})

app.delete('/delete/:data/in/:key', (req, res) => {
    const toDelete = req.params.data;
    const where = req.params.key;

    const whereIsTheData = gun.get(where);
    whereIsTheData.get(toDelete).put(null);
    res.status(200).send({ success: `${toDelete} has been successfully deleted in ${where} !` })
})

console.log(marked('# Starting Gunpoint API !'))
app.listen(PORT, () => { console.log(marked('**Gunpoint is running at http://localhost:' + PORT + '**')) })
