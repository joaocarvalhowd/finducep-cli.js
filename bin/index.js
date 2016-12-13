#! /usr/bin/env node

'use strict';

const meow = require('meow');
const FindUCep = require('./finducep.js');

const cli = meow(`
    Modo de uso:
      $ finducep <cep>
    Exemplo:
      $ finducep 05022001
`, {});

const cep = process.argv.slice(2)[0];
const finducep = new FindUCep();

finducep.find(cep)
	.then(response => {
		console.log(`
			Endereço: ${response.endereco},
			Bairro: ${response.bairro},
			Cidade: ${response.cidade},
			Estado: ${response.estado},
			UF: ${response.uf},
			CEP: ${response.cep}
		`);
	})
	.catch(response => console.log(response))

