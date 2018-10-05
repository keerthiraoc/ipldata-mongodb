async function fetchTopFive(sub) {
    const URL = `http://localhost:5000/${sub}`;
    const fetchResult = fetch(URL)
    const response = await fetchResult;
    const result = await response.json();
    var chart = c3.generate({
        data: {
            columns: [
                result.map(a => a.count)
            ],
            type: 'bar',
            labels: true
        },
        bar: {
            width: {
                ratio: 0.8
            }
        },
        legend: {
            show: false
        },
        tooltip: {
            show: false
        },
        color: {
            pattern: ['#87ceeb']
        },
        axis: {
            x: {
                type: 'category',
                categories: result.map(a => a._id),
                label: {
                    text: 'Years',
                    position: 'Outer-center'
                }
            },
            y: {
                label: {
                    text: 'Matches',
                    position: 'outer-middle'
                }
            }
        },
        bindto: '#chart'
    });
}
fetchTopFive('matches');
async function fetchTopsix(sub) {
    const URL = `http://localhost:5000/${sub}`;
    const fetchResult = fetch(URL)
    const response = await fetchResult;
    const result = await response.json();
    var chartOne = c3.generate({
        data: {
            columns: [
                result.map(a => a.count)
            ],
            type: 'bar',
            labels: true
        },
        bar: {
            width: {
                ratio: 0.8
            }
        },
        legend: {
            show: false
        },
        tooltip: {
            show: false
        },
        color: {
            pattern: ['#2ca02c']
        },
        axis: {
            x: {
                type: 'category',
                categories: result.map(a => a._id),
                label: {
                    text: 'Teams',
                    position: 'Outer-center'
                }
            },
            y: {
                label: {
                    text: 'Extra Runs',
                    position: 'outer-middle'
                }
            }
        },
        bindto: '#chartOne'
    });
}
fetchTopsix('extraruns');
async function fetchTopseven(sub) {
    const URL = `http://localhost:5000/${sub}`;
    const fetchResult = fetch(URL)
    const response = await fetchResult;
    const result = await response.json();
    var chartTwo = c3.generate({
        data: {
            columns: [
                result.map(a => a.economy)
            ],
            type: 'bar',
        },
        bar: {
            width: {
                ratio: 0.8
            }
        },
        legend: {
            show: false
        },
        tooltip: {
            show: false
        },
        color: {
            pattern: ['#8b8989']
        },
        axis: {
            x: {
                type: 'category',
                categories: result.map(a => a._id),
                label: {
                    text: 'Players',
                    position: 'Outer-center'
                }
            },
            y: {
                label: {
                    text: 'Economy',
                    position: 'outer-middle'
                }
            }
        },
        bindto: '#chartTwo'
    });
}
fetchTopseven('economy');

async function fetchTopnine(sub) {
    const URL = `http://localhost:5000/${sub}`;
    const fetchResult = fetch(URL)
    const response = await fetchResult;
    const result = await response.json();
    var chartFour = c3.generate({
        data: {
            columns: [
                result.map(a => a.total_runs)
            ],
            type: 'bar',
            labels: true
        },
        bar: {
            width: {
                ratio: 0.8
            }
        },
        legend: {
            show: false
        },
        tooltip: {
            show: false
        },
        color: {
            pattern: ['#9370db']
        },
        axis: {
            x: {
                type: 'category',
                categories: result.map(a => a._id),
                label: {
                    text: 'Players',
                    position: 'Outer-center'
                }
            },
            y: {
                label: {
                    text: 'Score',
                    position: 'outer-middle'
                }
            }
        },
        bindto: '#chartFour'
    });
}
fetchTopnine('topscorer');

async function fetchTopeight(sub) {
    const URL = `http://localhost:5000/${sub}`;
    const fetchResult = fetch(URL)
    const response = await fetchResult;
    const result = await response.json();
    let teamWonData = {},
        years = [],
        seriesData = [];
    for (let year = 2008; year <= 2017; year++) {
        years.push(year)
        teamWonData[year] = {}
        let teamname = [];
        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result[i].teamData.length; j++) {
                if (!teamname.includes(result[i].teamData[j].team)) {
                    if (result[i].teamData[j].team.length > 0) {
                        teamname.push(result[i].teamData[j].team);
                        teamWonData[year][result[i].teamData[j].team] = 0;
                    }
                }
            }
        }
    }
    for (let i = 0, year = 2008; i < result.length; i++, year++) {
        result[i]["teamData"].forEach(element => {
            if(element.team.length>0){
            teamWonData[year][element.team] = element.noOfMatches;
            }
        })
    }
    console.log(teamWonData)
    for(year in teamWonData){
        seriesData.push({
            name:year,
            data:Object.values(teamWonData[year])
        })
    }
    for (let i = 0, year = 2008; i < result.length; i++, year++) {
        seriesData[i].data.unshift(year);
    }
    console.log(seriesData);
    var chartThree = c3.generate({
        data: {
            columns:
            [seriesData[0].data,seriesData[1].data,seriesData[2].data,seriesData[3].data,seriesData[4].data,seriesData[5].data,seriesData[6].data,seriesData[7].data,seriesData[8].data,seriesData[9].data,],
            type: 'bar',
            groups:[['2008','2009','2010','2011','2012','2013','2014','2015','2016','2017']],
        },
        bar: {
            width: {
                ratio: 0.8
            }
        },
        legend: {
            show: true
        },
        tooltip: {
            show: true
        },
        Color: {
            pattern: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
        },
        axis: {
            x: {
                type: 'category',
                categories: ['Deccan Chargers','Kings XI Punjab','Rajasthan Royals','Royal Challengers Bangalore','Kolkata Knight Riders',
                'Delhi Daredevils','Mumbai Indians','Chennai Super Kings','Kochi Tuskers Kerala','Pune Warriors','Sunrisers Hyderabad','Gujarat Lions','Rising Pune Supergiants','Rising Pune Supergiant'],
                label: {
                    text: 'Teams',
                    position: 'Outer-center'
                }
            },
            y: {
                label: {
                    text: 'Matches',
                    position: 'outer-middle'
                }
            }
        },
        bindto: '#chartThree'
    });
}
fetchTopeight('matchesWon');