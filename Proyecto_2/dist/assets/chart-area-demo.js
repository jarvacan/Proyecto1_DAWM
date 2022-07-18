// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

let brand = "yu-phones-100"

let fetchYu = async () => {
  const response = await fetch(`https://api-mobilespecs.azharimm.site/v2/brands/${brand}`)
  const data = await response.json()
  const listaCelulares = data.data.phones
  const promises = await listaCelulares.map(cell => fetch(`https://api-mobilespecs.azharimm.site/v2/${cell.slug}`))
  Promise.all(promises)
    .then(responses => {
      responses.forEach(response => {
        console.log(response.status, response.url);
      })
      return responses
    })
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(users => {
      let axisX = users.map(user => user.data.phone_name)
      let axisY = users.map(user => parseInt(user.data.specifications[12].specs[user.data.specifications[12].specs.length-1].val[0].split(" ")[1]))
      var myLineChart = new Chart(ctxArea, {
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
                max: 13000,
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
var ctxArea = document.getElementById("myAreaChart");
fetchYu()
