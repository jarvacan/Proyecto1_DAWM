// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

let fetchBrand = async (brand) => {
  const response = await fetch(`https://api-mobilespecs.azharimm.site/v2/brands/${brand}`)
  const data = await response.json()
  const listaCelulares = data.data.phones
  const promises = await listaCelulares.map(cell => fetch(`https://api-mobilespecs.azharimm.site/v2/${cell.slug}`))
  Promise.all(promises)
    .then(responses => responses)
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(users => {
      let axisX = users.map(user => user.data.phone_name)
      let axisY = users.map(user => {
        let miscObj = user.data.specifications.find(spec => spec.title === "Misc");
        let priceObj = miscObj.specs.find(mis => mis.key === "Price")
        let priceStr = (typeof priceObj === 'object') ? priceObj.val[0].split(" ")[1] : "666"
        let price = isNaN(priceStr) ? parseFloat(priceObj.val[0].split(" ")[0].slice(2)) : parseFloat(priceStr)
        return price //el precio esta filtrado de valores nulos, indefinidos o NaN
      })
      let div_canvas = document.querySelector("div.col-xl-6:nth-child(1) > div:nth-child(1) > div:nth-child(2)")
      div_canvas.innerHTML = '<canvas id="myAreaChart" width="100%" height="40"></canvas>'
      let ctxArea = document.getElementById("myAreaChart");
      myLineChart = new Chart(ctxArea, {
        type: 'line',
        data: {
          labels: axisX.slice(0, 7),
          datasets: [{
            label: "Precio",
            lineTension: 0.3,
            backgroundColor: "rgba(2,117,216,0.2)",
            borderColor: "rgba(2,117,216,1)",
            pointRadius: 5,
            pointBackgroundColor: "rgba(2,117,216,1)",
            pointBorderColor: "rgba(255,255,255,0.8)",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(2,117,216,1)",
            pointHitRadius: 50,
            pointBorderWidth: 2,
            data: axisY.slice(0, 7),
          }],
        },
        options: {
          scales: {
            xAxes: [{
              gridLines: {
                display: false
              },
              ticks: {
                maxTicksLimit: 7
              }
            }],
            yAxes: [{
              ticks: {
                min: 0,
                max: Math.max(...axisY.slice(0, 7)) + 100,
                maxTicksLimit: 5
              },
              gridLines: {
                color: "rgba(0, 0, 0, .125)",
              }
            }],
          },
          legend: {
            display: false
          }
        }
      });
    })
}

// Area Chart Example
window.addEventListener('DOMContentLoaded', event => {
  let brand = document.getElementById('areaComboBox').value;
  fetchBrand(brand)

})

window.addEventListener('change', event => {
  if (event.target.id == "areaComboBox") {
    let brand = document.getElementById('areaComboBox').value;
    fetchBrand(brand)
  }
});