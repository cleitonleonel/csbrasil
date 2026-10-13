export const BRASAO_VERSAO = Object.freeze({"b":"6b4dafd917d0","c":"a95806f6a62f","e":"f7fb3c45ceeb","f":"20c1c20b06d7","m":"68b8c7b7403d","n":"f34dc61291d3","o":"4463c2a67d65","r":"2eafcf080627","t":"2120188e8b87","u":"7a703e200fbc"});
export const urlDoBrasao = (letra) => `img/brasoes/${letra}.png?v=${BRASAO_VERSAO[letra] || 'sem-versao'}`;
