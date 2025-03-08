import app from './app'

app.listen(app.get('port'), () => {
    console.log(`\n🚀 Server is running on: \n
        ➜ Local: \x1b[32mhttp://localhost:${app.get('port')}/palermo/api_node\x1b[0m`)
});