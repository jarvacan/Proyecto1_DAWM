let fetchTable = async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    const listaPhones = data.data.phones
    return listaPhones
}

function fillTable(datatable, selectedOption) {
    fetchTable(`https://api-mobilespecs.azharimm.site/v2/top-by-${selectedOption}`)
        .then(listaPhones => {
            listaPhones.forEach(phone => {
                var row = [];
                for (var p in phone) {
                    row.push(phone[p].toString());
                }
                datatable.rows().add(row)
            });
        })
}

// Simple-DataTables
// https://github.com/fiduswriter/Simple-DataTables/wiki
let datatable = new simpleDatatables.DataTable(document.getElementById('datatable'));

window.addEventListener('DOMContentLoaded', event => {
    let selectedOption = document.getElementById('tableComboBox').value;
    fillTable(datatable, selectedOption)
});

window.addEventListener('change', event => {
    if (event.target.id == "tableComboBox") {
        let selectedOption = document.getElementById('tableComboBox').value;
        datatable.data = []
        fillTable(datatable, selectedOption)
    }
});