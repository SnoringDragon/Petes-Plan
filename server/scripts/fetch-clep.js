const mongoose = require('mongoose');

function getClepData() {
    document.getElementById('info').innerHTML = "";
        var myTab = document.getElementById('empTable');

        // LOOP THROUGH EACH ROW OF THE TABLE AFTER HEADER.
        for (i = 1; i < myTab.rows.length; i++) {

            // GET THE CELLS COLLECTION OF THE CURRENT ROW.
            var objCells = myTab.rows.item(i).cells;

            // LOOP THROUGH EACH CELL OF THE CURENT ROW TO READ CELL VALUES.
            for (var j = 0; j < objCells.length; j++) {
                //save to database
            }
            info.innerHTML = info.innerHTML + '<br />';     // ADD A BREAK (TAG).
        }
}