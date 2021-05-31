const express = require("express");

const app = express();

app.get('/a/b/', (req, res) => {
    const cust = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'steve', lastName: 'smith' },
        { id: 3, firstName: 'mark', lastName: 'Carl' }
    ];
    res.json(cust);
})

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));