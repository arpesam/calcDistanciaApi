### Calcular Distância API
API para cálculo de distâncias geodésicas 

### Setup
- clone o repositório
- rode npm install
- rode npm start
- o endereço local será logado para que a requisição possa ser efetuada


### Requisição
A requisição post deve ser como a seguir:

```
// POST -> http://localhost:3000

{
    "lat1": "-23.5697121",
    "long1": "-46.5364942",
    "lat2": "-23.570473",
    "long2": "-46.5365351"
}
```

# Resposta 
// 84.71 (metros)


### Porque este projeto existe? 
Este projeto faz parte de um teste para uma vaga de engenheiro de software na Kovi. O teste propõe construir uma aplicação simples que recebe duas posições de latitute e longitude, daí calcula a distância geodésica entre os dois pontos. 
