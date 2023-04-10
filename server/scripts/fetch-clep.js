const mongoose = require('mongoose');

function getClepData() {
    document.getElementById('info').innerHTML = "https://www.admissions.purdue.edu/transfercredit/clep.php?_ga=2.156040763.1830545689.1680885941-405777200.1660331919";
        var table = document.getElementById('empTable');

        // LOOP THROUGH EACH ROW OF THE TABLE AFTER HEADER.
        for (i = 1; i < table.rows.length; i++) {

            // GET THE CELLS COLLECTION OF THE CURRENT ROW.
            var tests = table.rows.item(i).cells;

            // LOOP THROUGH EACH CELL OF THE CURENT ROW TO READ CELL VALUES.
            for (var j = 0; j < tests.length; j++) {
                //save to database
            }
            info.innerHTML = info.innerHTML + '<br />';     // ADD A BREAK (TAG).
        }
}