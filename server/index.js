const MongoClient = require('mongodb').MongoClient,
    url = 'mongodb://127.0.0.1:27017';

function testConnection(dbName) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, {
            useNewUrlParser: true
        }, function (err, conn) {
            if (err) {
                console.log("mongo db service not started")
                reject(err);
            }
            var dbConnection = conn.db(dbName);
            resolve(dbConnection);
        })
    }).catch(function (e) {})
}


function matchesPerYear(matches) {
    return new Promise((resolve, reject) => {
        testConnection("matches").then(async function (db1, err) {
            if (err) reject(err)
            var data = await db1.collection(matches)
            var match = await data.aggregate([{
                    $group: {
                        "_id": "$season",
                        "count": {
                            "$sum": 1
                        }
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                }
            ]).toArray();
            resolve(match);
        })
    }).catch(function (e) {})
}

function matchesWon(matches) {
    return new Promise((resolve, reject) => {
        testConnection("matches").then(async function (db1, err) {
            if (err) reject(err)
            var data = await db1.collection(matches)
            var match = await data.aggregate([{
                $group: {
                    _id: {
                        seasons: '$season',
                        teams: '$winner'
                    },
                    total: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    season: '$_id.seasons',
                    team: '$_id.teams',
                    total: '$total',
                    _id: 0
                }
            },
            {
                $group: {
                    _id: '$season',
                    teamData: {
                        $push: {
                            noOfMatches: "$total",
                            team: "$team"
                        }
                    }
                }
            },{
                $sort:{
                    _id:1
                }
            }
            ]).toArray();
            resolve(match);
        })
    }).catch(function (e) {})
}

function extraRuns(matches, deliveries, year) {
    return new Promise((resolve, reject) => {
        testConnection("matches").then(async function (db1, err) {
            if (err) reject(err)
            var data = await db1.collection(matches)
            var match = await data.aggregate([{
                    $match: {
                        season: year
                    }
                },
                {
                    $lookup: {
                        from: deliveries,
                        localField: "id",
                        foreignField: "match_id",
                        as: "balls"
                    }
                },
                {
                    $unwind: "$balls"
                },
                {
                    $group: {
                        "_id": "$balls.bowling_team",
                        count: {
                            "$sum": "$balls.extra_runs"
                        }
                    }
                }
            ]).toArray();
            resolve(match);
        })
    }).catch(function (e) {})
}

function economy(matches, deliveries, year) {
    return new Promise((resolve, reject) => {
        testConnection("matches").then(async function (db1, err) {
            if (err) reject(err)
            var data = await db1.collection(matches)
            var economy = await data.aggregate([{
                    "$match": {
                        "season": year
                    }
                },
                {
                    "$lookup": {
                        from: deliveries,
                        localField: "id",
                        foreignField: "match_id",
                        as: "balls"
                    }
                },
                {
                    "$unwind": "$balls"
                },
                {
                    "$group": {
                        "_id": "$balls.bowler",
                        "total_runs": {
                            "$sum": "$balls.total_runs"
                        },
                        "total_ball": {
                            "$sum": 1
                        },
                        "extra_ball": {
                            "$sum": {
                                "$cond": {
                                    if: {
                                        $ne: ["$balls.noball_runs", 0]
                                    },
                                    then: 1,
                                    else: {
                                        "$cond": {
                                            if: {
                                                $ne: ["$balls.wide_runs", 0]
                                            },
                                            then: 1,
                                            else: 0
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    "$project": {
                        "_id": 1,
                        "economy": {
                            "$multiply": [{
                                "$divide": ["$total_runs", {
                                    "$subtract": ["$total_ball", "$extra_ball"]
                                }]
                            }, 6]
                        }

                    }
                },
                {
                    $sort: {
                        economy: 1
                    }
                },
                {
                    $limit: 10
                }

            ]).toArray()
            resolve(economy)
        })
    }).catch(function (e) {})
}

function topScore(matches, deliveries, year) {
    return new Promise((resolve, reject) => {
        testConnection("matches").then(async function (db1, err) {
            if (err) reject(err)
            var data = await db1.collection(matches)
            var topScorer = await data.aggregate([{
                    "$match": {
                        "season": year
                    }
                },
                {
                    "$lookup": {
                        from: deliveries,
                        localField: "id",
                        foreignField: "match_id",
                        as: "batsman_runs"
                    }
                },
                {
                    "$unwind": "$batsman_runs"
                },
                {
                    "$group": {
                        "_id": "$batsman_runs.batsman",
                        "total_runs": {
                            "$sum": "$batsman_runs.total_runs"
                        },
                    }
                }, {
                    $sort: {
                        total_runs: -1
                    },
                }, {
                    $limit: 10
                },
            ]).toArray();
            resolve(topScorer);
        })
    }).catch(function (e) {})
}
module.exports = {
    matchesPerYear,
    economy,
    extraRuns,
    matchesWon,
    topScore
}