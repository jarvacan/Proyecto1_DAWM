// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

let fetchBrands = async () => {
  const response = await fetch("https://api-mobilespecs.azharimm.site/v2/brands")
  const data = await response.json()
  const listaMarcas = data.data
  const dict = new Map(listaMarcas.map(marca => [marca.brand_name, marca.device_count]))
  return dict;
}

// Bar Chart Example
var ctxBar = document.getElementById("myBarChart");

fetchBrands()
  .then(dict => {
    const sortedDict = new Map([...dict].sort((a, b) => b[1] - a[1]));
    var myLineChart = new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: Array.from(sortedDict.keys()).slice(0, 7),
        datasets: [{
          label: "Lanzamientos",
          backgroundColor: "rgba(2,117,216,1)",
          borderColor: "rgba(2,117,216,1)",
          data: Array.from(sortedDict.values()).slice(0, 7),
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
              max: 1500,
              maxTicksLimit: 5
            },
            gridLines: {
              display: true
            }
          }],
        },
        legend: {
          display: false
        }
      }
    });
  })
