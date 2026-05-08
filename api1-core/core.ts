const jsonFilePath = __dirname + '/data.temp.json'; // caminho do arquivo json

const list: string[] = await loadFromFile(); // carrega os dados ao iniciar

async function loadFromFile() { // função pra carregar arquivo
  try {
    const file = Bun.file(jsonFilePath); // pega o arquivo
    const content = await file.text(); // lê o conteúdo

    return JSON.parse(content) as string[]; // transforma em array
  } catch (error: any) {

    if (error.code === 'ENOENT') // verifica se o arquivo não existe
      return []; // retorna lista vazia

    throw error; // joga o erro caso seja outro
  }
}

async function saveToFile() { // função pra salvar no arquivo
  try {

    await Bun.write(
      jsonFilePath,
      JSON.stringify(list)
    ); // salva os dados

  } catch (error: any) {

    throw new Error(
      "Erro ao salvar os dados no arquivo: " + error.message
    ); // erro ao salvar
  }
}

async function addItem(item: string) { // adiciona item
  list.push(item); // coloca no array
  await saveToFile(); // salva no arquivo
}

async function getItems() { // pega os itens
  return list; // retorna lista
}

async function updateItem(index: number, newItem: string) { // atualiza item

  if (index < 0 || index >= list.length) // verifica se índice existe
    throw new Error("Index fora dos limites"); // erro caso inválido

  list[index] = newItem; // troca o item

  await saveToFile(); // salva alterações
}

async function removeItem(index: number) { // remove item

  if (index < 0 || index >= list.length) // verifica índice
    throw new Error("Index fora dos limites"); // erro se inválido

  list.splice(index, 1); // remove do array

  await saveToFile(); // salva alterações
}

export default {
  addItem,
  getItems,
  updateItem,
  removeItem
}; // exporta as funções