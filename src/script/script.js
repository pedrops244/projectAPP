document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('startButton');
  const codigoInput = document.getElementById('codigo');
  const quantidadeInput = document.getElementById('quantidade');
  const addButton = document.getElementById('addButton');
  const sendButton = document.getElementById('sendButton');
  const produtosDiv = document.getElementById('produtos');
  const preview = document.getElementById('preview');
  const pedidosDiv = document.getElementById('ordersList');
  const scannerSection = document.getElementById('scannerSection');
  const ordersSection = document.getElementById('ordersSection');
  const pedidosButton = document.getElementById('ordersTab');
  const scannerButton = document.getElementById('scannerTab');

  let pedidos = [];

  startButton.addEventListener('click', function () {
    startCamera();
  });

  addButton.addEventListener('click', function () {
    const codigo = codigoInput.value;
    const quantidade = parseInt(quantidadeInput.value);

    if (codigo && quantidade > 0) {
      addProduto(codigo, quantidade);
      quantidadeInput.value = '';
    } else {
      alert('Por favor, insira um código e uma quantidade válida.');
    }
  });

  sendButton.addEventListener('click', function () {
    enviarProdutos();
  });

  pedidosButton.addEventListener('click', function () {
    scannerSection.style.display = 'none';
    ordersSection.style.display = 'block';
    exibirPedidos();
  });

  scannerButton.addEventListener('click', function () {
    scannerSection.style.display = 'block';
    ordersSection.style.display = 'none';
  });

  function startCamera() {
    preview.style.display = 'block';
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: preview,
          constraints: {
            facingMode: 'environment',
          },
        },
        decoder: {
          readers: ['code_128_reader'],
        },
      },
      function (err) {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Câmera iniciada');
        Quagga.start();
      },
    );

    Quagga.onDetected(function (data) {
      const codigo = data.codeResult.code;
      codigoInput.value = codigo;
      console.log('Código detectado:', codigo);
    });
  }

  function addProduto(codigo, quantidade) {
    const produtoDiv = document.createElement('div');
    produtoDiv.classList.add('produto');

    const produtoInfo = document.createElement('div');
    produtoInfo.style.cursor = 'pointer';
    produtoInfo.innerHTML = `
      Produto: ${codigo} - Quantidade: ${quantidade}
      <i class="produto-info fas fa-chevron-down"></i>`;
    produtoDiv.appendChild(produtoInfo);

    const excluirButton = document.createElement('button');
    excluirButton.innerText = 'Excluir';
    excluirButton.classList.add('btn-excluir');
    excluirButton.addEventListener('click', function () {
      produtosDiv.removeChild(produtoDiv);
    });
    produtoDiv.appendChild(excluirButton);

    const produtoDetails = document.createElement('div');
    produtoDetails.classList.add('produto-details');

    for (let i = 0; i < quantidade; i++) {
      const unidadeDiv = document.createElement('div');
      unidadeDiv.innerText = `${i + 1} Unidade | ${codigo}`;
      unidadeDiv.classList.add('unidade');
      produtoDetails.appendChild(unidadeDiv);
    }

    produtoInfo.addEventListener('click', function () {
      const isVisible = produtoDetails.style.display === 'block';
      produtoDetails.style.display = isVisible ? 'none' : 'block';

      const icon = produtoInfo.querySelector('i');
      icon.className = isVisible
        ? 'produto-info fas fa-chevron-down'
        : 'produto-info fas fa-chevron-up';
    });

    produtoDiv.appendChild(produtoDetails);
    produtosDiv.appendChild(produtoDiv);
  }

  function enviarProdutos() {
    const produtos = Array.from(produtosDiv.children).map((produtoDiv) => {
      const produtoDetails = produtoDiv.querySelector('.produto-details');
      const quantidade = produtoDetails.childElementCount;

      const produtoInfo = produtoDiv.querySelector('div');
      const codigo = produtoInfo.innerText
        .replace('Produto: ', '')
        .split(' - ')[0];

      return { codigo, quantidade };
    });

    if (produtos.length === 0) {
      alert('Nenhum produto para enviar.');
      return;
    }

    pedidos.push(produtos);

    console.log('Enviando produtos:', produtos);
    alert('Produtos enviados com sucesso!');

    produtosDiv.innerHTML = '';
  }

  function exibirPedidos() {
    pedidosDiv.innerHTML = '';

    pedidos.forEach((pedido, index) => {
      const pedidoDiv = document.createElement('div');
      pedidoDiv.classList.add('pedido');
      pedidoDiv.innerHTML = `<h3>Pedido ${index + 1}</h3>`;

      pedido.forEach((produto) => {
        const produtoDiv = document.createElement('div');
        produtoDiv.innerText = `Produto: ${produto.codigo}, Quantidade: ${produto.quantidade}`;
        pedidoDiv.appendChild(produtoDiv);
      });

      pedidosDiv.appendChild(pedidoDiv);
    });
  }
});
