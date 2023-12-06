function setMenuCartTotal(value) {
    document.getElementById('menu-cart-total').innerHTML = value;
}

function changeMenuCartTotal(value) {
    const menuCartTotal = document.getElementById('menu-cart-total');
    menuCartTotal.innerHTML = parseInt(menuCartTotal.innerHTML) + value;
}

async function displayMenuCartTotal() {
    const userId = getSessionLoginUserId();

    if (!userId) {
        setMenuCartTotal(0);
        return;
    }

    const totalQuantity = await dbGetCartQuantity(userId);
    setMenuCartTotal(totalQuantity);
}

async function addCart(productId) {
    const userId = getSessionLoginUserId();

    if (!userId) {
        alert('Please log in to use the cart!');
        return;
    }

    const oldCartItem = await dbGetCartItem(userId, productId);

    let newCartItem = {
        productId: productId,
        quantity: 1,
    };

    if (oldCartItem) {
        newCartItem.quantity = oldCartItem.quantity + 1;
        const isCartItemChanged = dbChangeCartItemQuantity(userId, oldCartItem, newCartItem);

        if (isCartItemChanged)
            changeMenuCartTotal(1);

        return;
    }

    const isCartItemAdded = dbAddCartItem(userId, newCartItem);

    if (isCartItemAdded)
        changeMenuCartTotal(1);
}