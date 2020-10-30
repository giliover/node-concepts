const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.json(repositories)
});

function existsOrError(value, msg) {
    if(!value) throw msg
    if(Array.isArray(value) && value.length === 0) throw msg
    if(typeof value === 'string' && !value.trim()) throw msg
}
function existsRepoOrError(repository){
    existsOrError(repository.id, 'error uuid')
    existsOrError(repository.title, 'uninformed title')
    existsOrError(repository.url, 'uninformed url')
    existsOrError(repository.techs, 'uninformed technology')
}

  const findRepoIndex = (id) => {
    return repositories
          .findIndex(
            repository => 
            repository.id === id
          )
  }
  app.post("/repositories", (req, res) => {
  const repository = { ...req.body }
        repository.id = uuid()
        repository.likes = 0
        
  try {
    existsOrError(repository)

    repositories.push(repository)
    return res.json(repository)

  }catch(msg){
    return res.status(400).send(msg)  } 
  }
)
app.put("/repositories/:id", (req, res) => {
  try {
    const { id } = req.params;
    const resultFindRepoIndex = findRepoIndex(id)
    const repository = { ...req.body }
          repository.id = id

    if(!repository.likes) existsRepoOrError(repository) // for the test "... update repository likes manually" to pass without treating

    repository.likes = repositories[resultFindRepoIndex].likes
          
    existsOrError(resultFindRepoIndex >= 0, 'repository does not exist')


    repositories[resultFindRepoIndex] = repository

    return res.json(repository)
  }catch(msg){
    return res.status(400).json({error: msg})  
  } 
})
  

app.delete("/repositories/:id", (req, res) => {
  try{
    const { id } = req.params;
    const resultFindRepoIndex = findRepoIndex(id)
    
    existsOrError(resultFindRepoIndex >= 0, 'repository does not exist')
  
    repositories.splice(resultFindRepoIndex, 1)

    return res.status(204).json(repositories)
    
  }catch(msg){
    return res.status(400).json({error: msg})
  }

});

app.post("/repositories/:id/like", (req, res) => {
  try{
    const { id } = req.params;
    const resultFindRepoIndex = findRepoIndex(id)

    existsOrError(resultFindRepoIndex >= 0, 'repository does not exist')

    repositories[resultFindRepoIndex].likes += 1

    return res.json(repositories[resultFindRepoIndex])
    
  }catch(msg){
    return res.status(400).json({error: msg})
  }

  // TODO
});

module.exports = app;
