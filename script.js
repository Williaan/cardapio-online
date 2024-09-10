const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const carItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModal = document.getElementById('close-modal-btn');
const count = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');


let cart = [];

//Open Modal
cartBtn.addEventListener('click', function () {
    updateCartModal();
    cartModal.style.display = 'flex';

});

//Close Modal out in the window
cartModal.addEventListener('click', function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

closeModal.addEventListener('click', function () {
    cartModal.style.display = 'none';
});


//--------------------

menu.addEventListener('click', function (event) {
    let parentButton = event.target.closest('.add-to-cart-btn');

    if (parentButton) {
        const name = parentButton.getAttribute('data-name');
        const price = parseFloat(parentButton.getAttribute('data-price'));

        addToCard(name, price);
    }


});


//Add to cart function

function addToCard(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
        console.log(existingItem);


    }
    else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateCartModal();
}



function updateCartModal() {
    carItemsContainer.innerHTML = '';

    let total = 0;

    cart.forEach(item => {
        const carItemsElement = document.createElement('div');
        carItemsElement.classList.add('flex', 'justfy-between', 'mb-4', 'flex-col')

        carItemsElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">${(item.price * item.quantity).toFixed(2)}</p>
            </div>

            <div>
                <button class="remove-cart-btn" data-name=${item.name}>Remover</button>
            </div>
        
        </div>
        
        `;

        total += item.price * item.quantity;


        carItemsContainer.appendChild(carItemsElement);
    });


    cartTotal.textContent = total.toLocaleString('pt-BR',
        {
            style: "currency",
            currency: "BRL"
        });

    count.innerHTML = cart.length;
}


//Remove item card

carItemsContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-cart-btn')) {
        const name = event.target.getAttribute('data-name');

        removeItemCard(name);
    }
});


function removeItemCard(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;

            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }

}


addressInput.addEventListener('input', function (event) {
    let inputValue = event.target.value;

    if (inputValue !== '') {
        addressInput.classList.remove('border-red-500');
        addressWarn.classList.add('hidden');
    }
});



checkoutBtn.addEventListener('click', function () {
    const isOpen = checkRestaurantOpen();

    if (!isOpen) {

        Toastify({
            text: "Restaurante fechado no momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if (cart.length === 0) {
        return;
    }

    if (addressInput.value === '') {
        addressWarn.classList.remove('hidden');
        addressInput.classList.add('border-red-500');
    }



    //enviar para whatsapp

    const cartItems = cart.map((item) => {
        return (
            `Qtd: (${item.quantity}), ${item.name}, Preço: R$${(item.price * item.quantity).toFixed(2)} | `
        )
    }).join('');

    const message = encodeURIComponent(cartItems);
    const phone = '8194239002';

    window.open(`https://wa.me/${phone}?text=${message} Endereço para entrega: ${addressInput.value}`, "_blank");

    cart = [];
    updateCartModal();
});


function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 17 && hora < 22;
}


const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove('bg-red-500');
    spanItem.classList.add('bg-green-500');

} else {
    spanItem.classList.remove('bg-green-500');
    spanItem.classList.add('bg-red-500');
}



