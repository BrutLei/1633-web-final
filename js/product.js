function displayProducts(element, products) {
  if (products.length === 0) {
    element.innerHTML = "<div>No product.</div>";
    return;
  }

  for (const product of products)
    element.innerHTML += displayProductCard(product);
}

function displayProductCard(product) {
  return `
    <div class='col-6 col-lg-4 col-xl-3 mt-3'>
        <div class='card'>
            <img src='${product.image}' class='card-img-top' alt='${
    product.name
  } Image' height='200px' style='object-fit: cover;'>
            
            <div class='card-body'>
                <h5 class='card-title'>${product.name}</h5>
                <p class='card-text text-muted'>${formatCurrency(
                  product.price
                )}</p>
                
                <div class='text-center'>
                    <a class='btn btn-dark' onclick='addCart("${
                      product.id
                    }");'>Add to cart</a>
                </div>
            </div>
        </div>
    </div>`;
}
