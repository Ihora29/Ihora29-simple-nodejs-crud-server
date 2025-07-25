const http = require("http");
const https = require('https')
const fs = require('fs');
const path = require('path');
const mimeTypes = require('./modules/mimeTypes');
//const users = require('./data/users.json');
const parseUrl = require('url');


const request = require('request');

const usersPath = path.basename('/data/users.json');


http.createServer(function (req, res) {
    const url = req.url;
    const ex = parseUrl.parse(url, true);
    const { pathname, query } = ex;
    // const { pathname, query } = parsedUrl;
    const method = req.method;

    if (url === '/app', method === 'POST') {
        let guest = '';
        req.on('data', (chunk) => {
            guest += chunk;

            return
        });
        req.on('end', () => {
            const parsedUser = JSON.parse(guest);
            fs.readFile('./data/users.json', 'utf-8', function (err, data) {
                if (err) {
                    console.log(err);
                }
                let allUsers;

                try {
                    allUsers = JSON.parse(data);

                } catch (parseErr) {
                    console.error("Помилка розбору JSON:", parseErr);
                    return;
                }

                if (allUsers.length == 0) {
                    parsedUser.id = 1;
                    allUsers.push(parsedUser);
                }
                else {
                    parsedUser.id = allUsers.length + 1;
                    allUsers.push(parsedUser);
                }
                fs.writeFile('./data/users.json', JSON.stringify(allUsers, null, 2), (err) => {
                    if (err) {
                        console.log(err);
                        return
                    }
                })

            })

        }).on('error', (err) => {
            console.log(err);
        })
    }

    if (url === '/app', method === 'PUT') {
        let userData = '';
        console.log('put');

        req.on('data', (chunk) => {
            userData += chunk;
            // console.log('putData', typeof (userData));
            return
        });
        req.on('end', () => {
            const parsedUserData = JSON.parse(userData);
            console.log('parsedUserData', parsedUserData);

            fs.readFile('./data/users.json', 'utf-8', (err, data) => {
                if (err) {
                    console.log(err);

                }
                let allUsersData;
                try {
                    allUsersData = JSON.parse(data);
                } catch (parseErr) {
                    console.error("Помилка розбору JSON:", parseErr);
                    return;
                }

                let userFind = allUsersData.find(item => item.email === parsedUserData.email && item.name === parsedUserData.name);
                if (userFind) {
                    userFind.title = parsedUserData.title;
                    fs.writeFile('./data/users.json', JSON.stringify(allUsersData, null, 2), (err) => {
                        if (err) {
                            console.log(err);
                            return
                        }
                    })

                } else {

                    console.log('nema');

                }



            })

        })


    }

    if (url === '/app', method === 'DELETE') {
        let userDelete = '';
        console.log('filter', req.method);
        req.on('data', (chunk) => {
            userDelete += chunk;
            return
        })
        req.on('end', function () {
            const parsedDeleteUser = JSON.parse(userDelete);
            fs.readFile('./data/users.json', 'utf-8', function (err, data) {
                if (err) {
                    console.log(err);
                }
                let ParseUsersArr;

                try {
                    ParseUsersArr = JSON.parse(data);
                } catch (error) {
                    console.log(error);
                }


                const updtParsedUsers = ParseUsersArr.filter(user => user.name !== parsedDeleteUser.name && user.email !== parsedDeleteUser.email);
                console.log('updtParsedUsers', updtParsedUsers);
                fs.writeFile('./data/users.json', JSON.stringify(updtParsedUsers, null, 2), (error) => {
                    if (error) {
                        console.log(error);

                    }
                })



            })

        })

    }
    switch (pathname) {
        case '/app':
            res.setHeader('Content-Type', 'text/html')
            fs.readFile('./html/index.html', function (err, data) {
                if (err) {
                    console.log(err);

                } else {
                    res.end(data)
                }
            })
            break;
            9
        case '/users':
            res.setHeader('Content-Type', 'application/json');
            fs.readFile('./data/users.json', function (error, data) {
                if (error) {
                    console.log(error);
                    res.end()
                    return
                }
                let filterUsers = JSON.parse(data);
                if (query.id) {
                    const findUser = filterUsers.filter(user => user.id == query.id);

                    return res.end(JSON.stringify(findUser))


                }
                res.end(JSON.stringify(filterUsers))
            })
            break;

        default:
            res.end()
            break;
    }

}).listen(4000);





;