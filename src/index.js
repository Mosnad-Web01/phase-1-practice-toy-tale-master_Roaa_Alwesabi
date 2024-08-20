document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  let addToy = false;

  // عرض أو إخفاء نموذج إضافة لعبة
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // إرسال طلب GET لعرض الألعاب عند تحميل الصفحة
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      const toyCollection = document.getElementById("toy-collection");
      toys.forEach(toy => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" />
          <p>${toy.likes} Likes</p>
          <button class="like-btn" id="${toy.id}">Like ❤️</button>
        `;
        toyCollection.appendChild(card);
      });

      // إضافة مستمعين لأزرار "Like"
      document.querySelectorAll(".like-btn").forEach(button => {
        button.addEventListener("click", handleLikeClick);
      });
    })
    .catch(error => console.error("GET error:", error));

  // إضافة لعبة جديدة عند تقديم النموذج
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const image = event.target.image.value;

    console.log("Adding new toy:", { name, image });

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0
      })
    })
    .then(response => response.json())
    .then(newToy => {
      console.log("New toy added:", newToy);
      const toyCollection = document.getElementById("toy-collection");
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h2>${newToy.name}</h2>
        <img src="${newToy.image}" class="toy-avatar" />
        <p>${newToy.likes} Likes</p>
        <button class="like-btn" id="${newToy.id}">Like ❤️</button>
      `;
      toyCollection.appendChild(card);

      // إعادة تعيين النموذج
      toyForm.reset();
      toyFormContainer.style.display = "none";

      // إضافة مستمعين لأزرار "Like"
      document.querySelectorAll(".like-btn").forEach(button => {
        button.addEventListener("click", handleLikeClick);
      });
    })
    .catch(error => console.error("POST error:", error));
  });

  // معالجة النقرات على أزرار "Like"
  function handleLikeClick(event) {
    const id = event.target.id;
    
    fetch(`http://localhost:3000/toys/${id}`)
      .then(response => response.json())
      .then(toy => {
        const newLikes = toy.likes + 1;
        return fetch(`http://localhost:3000/toys/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ likes: newLikes })
        });
      })
      .then(response => response.json())
      .then(updatedToy => {
        const toyCard = document.getElementById(id).closest(".card");
        toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error("PATCH error:", error));
  }
});
