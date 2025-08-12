# Previsão do Tempo 🌤️

<p align="center">
  <img src="https://img.shields.io/badge/tech-JavaScript-yellow.svg" alt="Tech">
  <img src="https://img.shields.io/badge/status-concluído-brightgreen.svg" alt="Status">
</p>

Aplicação web front-end desenvolvida para consultar o clima e a previsão do tempo de qualquer cidade do mundo. O projeto consome dados da [OpenWeather API](https://openweathermap.org/api) e os exibe em uma interface limpa e responsiva.

## ✨ Funcionalidades

-   **Busca por Cidade:** Pesquise o clima de qualquer cidade do mundo.
-   **Clima Atual:** Veja a temperatura atual, descrição do tempo (ex: "céu limpo"), e velocidade do vento.
-   **Previsão de 5 Dias:** Obtenha a previsão das temperaturas mínimas e máximas para os próximos cinco dias.
-   **Interface Responsiva:** O layout se adapta a diferentes tamanhos de tela, de desktops a dispositivos móveis.
-   **Feedback ao Usuário:** Exibe mensagens de "Carregando..." e de erro para uma melhor experiência de uso.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

| Tecnologia | Descrição |
| :--- | :--- |
| **HTML5** | Estruturação semântica do conteúdo. |
| **CSS3** | Estilização da interface, com uso de Flexbox para criar um layout moderno e responsivo. |
| **JavaScript (ES6+)**| Lógica da aplicação, manipulação do DOM e requisições à API com `async/await` e `Promise.all`. |
| **OpenWeather API**| Fornecimento dos dados de geolocalização, clima atual e previsão do tempo. |

## 🚀 Arquitetura e Como Funciona

A lógica da aplicação segue um fluxo eficiente para obter e exibir os dados do clima:

1.  **Captura do Input:** O script aguarda o usuário digitar o nome de uma cidade e submeter o formulário.

2.  **Geocodificação:** Uma requisição é enviada ao endpoint de **Geocoding** da OpenWeather API para converter o nome da cidade em coordenadas geográficas (latitude e longitude).

3.  **Busca Paralela de Dados:** Com as coordenadas obtidas, o `Promise.all` é utilizado para disparar duas requisições à API de forma simultânea, otimizando o tempo de resposta:
    * Uma chamada ao endpoint de **Current Weather** para obter os dados do clima em tempo real.
    * Uma chamada ao endpoint de **5 day / 3 hour Forecast** para obter a previsão do tempo para os próximos 5 dias, com dados fornecidos em intervalos de 3 horas.

4.  **Processamento dos Dados:** Uma função (`dadosPrevisao`) processa a lista de previsões de 3 em 3 horas. Ela agrupa os dados por dia e calcula a temperatura mínima e máxima para cada um deles, garantindo um resumo diário preciso.

5.  **Renderização Dinâmica:** Por fim, as informações processadas são inseridas dinamicamente no HTML, atualizando a interface para o usuário.

## ⚙️ Instalação e Execução

Para executar o projeto localmente, siga os passos abaixo:

1.  Clone este repositório:
    ```sh
    git clone https://github.com/gabrielsilvaa12/climaTempo.git
    ```
2.  Navegue até o diretório do projeto:
    ```sh
    cd climaTempo
    ```
3.  Abra o arquivo `index.html` em seu navegador de preferência.

A aplicação estará pronta para uso.
