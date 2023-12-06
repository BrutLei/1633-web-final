const dbCartName = "carts";
const dbUserName = "users";
const dbProductName = "products";
const sessionLoginUser = "loginUser";

const firebaseConfig = {
  // apiKey: "AIzaSyCWwwJcdiLxlgAfbETURMCdn75PHPGr7sQ",
  // authDomain: "office-1-71a06.firebaseapp.com",
  // projectId: "office-1-71a06",
  // storageBucket: "office-1-71a06.appspot.com",
  // messagingSenderId: "442573591262",
  // appId: "1:442573591262:web:e94cd25617f3d658a7284f",

  apiKey: "AIzaSyBV_ME9ihT5fZKf3j0h301XJkMD2g-ht14",
  authDomain: "my-1633-app.firebaseapp.com",
  projectId: "my-1633-app",
  storageBucket: "my-1633-app.appspot.com",
  messagingSenderId: "155215252548",
  appId: "1:155215252548:web:7a00154088406adead4011",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function getSessionLoginUser() {
  return JSON.parse(sessionStorage.getItem(sessionLoginUser));
}

function getSessionLoginUserId() {
  const user = getSessionLoginUser();
  return user ? user.uid : null;
}

function setSessionLoginUser(user) {
  sessionStorage.setItem(sessionLoginUser, JSON.stringify(user));
}

function removeSessionLoginUser() {
  sessionStorage.removeItem(sessionLoginUser);
}

function dbGetProducts() {
  const products = [];

  return new Promise((resolve, reject) => {
    db.collection(dbProductName)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((document) => {
          const productData = document.data();

          const product = {
            id: document.id,
            name: productData.name,
            price: productData.price,
            image: productData.image,
            description: productData.description,
          };

          products.push(product);
        });

        resolve(products);
      })
      .catch((error) => {
        console.error("Error getting products:", error);
        resolve(products);
      });
  });
}

function dbGetProduct(productId) {
  let product = null;

  return new Promise((resolve, reject) => {
    db.collection(dbProductName)
      .doc(productId)
      .get()
      .then((document) => {
        if (document.exists) {
          const productData = document.data();

          product = {
            id: document.id,
            name: productData.name,
            price: productData.price,
            image: productData.image,
            description: productData.description,
          };
        }

        resolve(product);
      })
      .catch((error) => {
        console.error("Error getting product:", error);
        resolve(product);
      });
  });
}

function dbAddProduct(product) {
  return new Promise((resolve, reject) => {
    db.collection(dbProductName)
      .add(product)
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        resolve(false);
      });
  });
}

function dbAddUser(user) {
  return new Promise((resolve, reject) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((userCredential) => {
        userCredential.user.updateProfile({
          displayName: user.displayName,
          photoURL: user.photoURL,
        });

        dbInitializeCart(userCredential.user.uid);

        resolve(userCredential.user);
      })
      .catch((error) => {
        console.error("Error creating user account:", error);
        reject(error);
      });
  });
}

function dbAuthenticate(email, password) {
  return new Promise((resolve, reject) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        resolve(userCredential.user);
      })
      .catch((error) => {
        console.error("Authentication failed:", error);
        reject(error);
      });
  });
}

function dbSignOut() {
  return new Promise((resolve, reject) => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        console.error("Sign out failed:", error);
        resolve(false);
      });
  });
}

function dbInitializeCart(userId) {
  return new Promise((resolve, reject) => {
    db.collection(dbCartName)
      .doc(userId)
      .set({
        totalQuantity: 0,
        products: [],
      })
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        console.error("Error initializing cart:", error);
        resolve(false);
      });
  });
}

function dbGetCartItems(userId) {
  let cartItems = [];

  return new Promise((resolve, reject) => {
    db.collection(dbCartName)
      .doc(userId)
      .get()
      .then((document) => {
        if (document.exists) cartItems = document.data().products;

        resolve(cartItems);
      })
      .catch((error) => {
        console.error("Error getting cart items:", error);
        resolve(cartItems);
      });
  });
}

function dbGetCartItem(userId, productId) {
  let cartItem = null;

  return new Promise((resolve, reject) => {
    db.collection(dbCartName)
      .doc(userId)
      .get()
      .then((cart) => {
        if (cart.exists)
          cartItem = cart
            .data()
            .products.find((item) => item.productId === productId);

        resolve(cartItem);
      })
      .catch((error) => {
        console.error("Error getting cart item:", error);
        resolve(cartItem);
      });
  });
}

function dbAddCartItem(userId, cartItem) {
  return new Promise((resolve, reject) => {
    db.collection(dbCartName)
      .doc(userId)
      .update({
        totalQuantity: firebase.firestore.FieldValue.increment(
          cartItem.quantity
        ),
        products: firebase.firestore.FieldValue.arrayUnion(cartItem),
      })
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        console.error("Error adding cart item:", error);
        resolve(false);
      });
  });
}

function dbRemoveCartItem(userId, cartItem) {
  return new Promise((resolve, reject) => {
    db.collection(dbCartName)
      .doc(userId)
      .update({
        totalQuantity: firebase.firestore.FieldValue.increment(
          -cartItem.quantity
        ),
        products: firebase.firestore.FieldValue.arrayRemove(cartItem),
      })
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        console.error("Error removing cart item:", error);
        resolve(false);
      });
  });
}

function dbChangeCartItemQuantity(userId, oldCartItem, newCartItem) {
  const isRemoved = dbRemoveCartItem(userId, oldCartItem);

  if (isRemoved) return dbAddCartItem(userId, newCartItem);

  return Promise.resolve(false);
}

function dbGetCartQuantity(userId) {
  let totalQuantity = 0;

  return new Promise((resolve, reject) => {
    db.collection(dbCartName)
      .doc(userId)
      .get()
      .then((cart) => {
        if (cart.exists) totalQuantity = cart.data().totalQuantity;

        resolve(totalQuantity);
      })
      .catch((error) => {
        console.error("Error getting cart quantity:", error);
        resolve(totalQuantity);
      });
  });
}
