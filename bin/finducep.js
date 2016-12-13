const axios = require('axios');

class FindUCep {

  validateCep(cep) {
    const CepValue = cep.replace(/[^0-9]/g, '');

    if (CepValue.length === 8) {
      return true;
    }

    return false;
    
  }

  find(cep) {

    if (this.validateCep(cep)) {
      return this.webMania(cep)
                .catch(() => this.viaCep(cep));
    }

    return Promise.reject(false);
  }

  webMania(cep) {
    return axios.get(`https://webmaniabr.com/api/1/cep/${cep}/?app_key=PxQtu0NJd0v6B2sPBUR0leTE8Eryi1ZN&app_secret=KffqAXnZIz6Wmb9pYWYkCFag0qHw1z4jsKHeKw3IpKF39Qur`)
            .then(this.handleWebmania.bind(this))
            .catch(this.handleError);
  }

  viaCep(cep) {
    return axios.get(`https://viacep.com.br/ws/${cep}/json/`)
            .then(this.handleViaCep.bind(this))
            .catch(this.handleError);
  }

  handleWebmania(response) {

    if (response.data.uf === '') {
      return Promise.reject('CEP não encontrado');
    }

    let data = response.data;
    const estado = this.getState(data.uf);

    data = Object.assign({}, data, { estado });

    return data;
  }

  handleViaCep(response) {
    const data = response.data;

    if (response.status !== 200 || data.erro) {
      return Promise.reject('CEP não encontrado');
    }

    const estado = this.getState(data.uf);

    return {
      cep: data.cep,
      endereco: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado,
      uf: data.uf,
    };
  }

  getState(uf) {
    const states = {
      AC: 'Acre',
      AL: 'Alagoas',
      AM: 'Amazonas',
      AP: 'Amapá',
      BA: 'Bahia',
      CE: 'Ceará',
      DF: 'Distrito Federal',
      ES: 'Espírito Santo',
      GO: 'Goiás',
      MA: 'Maranhão',
      MT: 'Mato Grosso',
      MS: 'Mato Grosso do Sul',
      MG: 'Minas Gerais',
      PA: 'Pará',
      PB: 'Paraíba',
      PR: 'Paraná',
      PE: 'Pernambuco',
      PI: 'Piauí',
      RJ: 'Rio de Janeiro',
      RN: 'Rio Grande do Norte',
      RO: 'Rondônia',
      RS: 'Rio Grande do Sul',
      RR: 'Roraima',
      SC: 'Santa Catarina',
      SE: 'Sergipe',
      SP: 'São Paulo',
      TO: 'Tocantins',
    };

    return states[uf];
  }

  handleError() {
    return Promise.reject('CEP não encontrado');
  }

}

module.exports = FindUCep;


