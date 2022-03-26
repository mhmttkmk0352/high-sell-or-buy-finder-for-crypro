const es = require("elasticsearch");
const elasticClient = new es.Client({
    host:"localhost:9200"
});

class App {

    constructor(){
        this.createIndex("ftx").then()
    }

    async createIndex(indexName) {
        try{
            return await elasticClient.indices.get({
                index: indexName
            });
        }catch(e){
            return await elasticClient.indices.create({
                index: indexName
            });
        }
    }

    async insertData(indexName, data){
        try{
            return await elasticClient.index({
                index:indexName,
                body:data
            })
        }catch(e){

        }
    }
}


module.exports = new App;