document.addEventListener('DOMContentLoaded', () => {
  function fetchQuotes() {
    fetch('http://localhost:3000/quotes?_embed=likes')
      .then(resp => resp.json())
      .then(data => {
        for (const quote of data) {
          addQuote(quote)
        }
      })
  }

  function createQuote(quoteObj) {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify(quoteObj)
    }
    fetch('http://localhost:3000/quotes', options)
      .then(resp => resp.json())
      .then(data => addQuote(data))   
  }

  function updateQuote(quoteId, body) {
    const options = {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify(body)
    }
    fetch(`http://localhost:3000/quotes/${quoteId}`, options)
  }

  function deleteQuote(quoteId) {
    const options = {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "accept": "application/json"
      }
    }
    fetch(`http://localhost:3000/quotes/${quoteId}`, options)
  }

  function updateLike(quoteId) {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify({
        quoteId: parseInt(quoteId),
        createdAt: Date.now()
      })
    }
    fetch('http://localhost:3000/likes', options)
  }

  function addQuote(quoteObj) {
    const newLi = document.createElement('li')
    newLi.className = 'quote-card'
    newLi.id = quoteObj.id
    newLi.innerHTML = `
        <blockquote class="blockquote">
          <p class="mb-0">${quoteObj.quote}</p>
          <footer class="blockquote-footer">${quoteObj.author}</footer>
          <br>
          <button class='btn-success'>Likes: <span>${quoteObj.likes.length}</span></button>
          <button class='btn-primary'>Edit</button>
          <button class='btn-danger'>Delete</button>
        </blockquote>
        <form id="edit-quote-form" style="display:none">
          <div class="form-group">
            <label for="edit-quote">Edit Quote</label>
            <input name="quote" type="text" class="form-control" id="edit-quote" value="${quoteObj.quote}">
          </div>
          <div class="form-group">
            <label for="Author">Author</label>
            <input name="author" type="text" class="form-control" id="author" value="${quoteObj.author}">
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      `
    document.querySelector('#quote-list').append(newLi)
  }

  document.querySelector('#quote-list').addEventListener('click', e => {
    if(e.target.className == 'btn-danger'){
      deleteQuote(e.target.parentNode.parentNode.id)
      e.target.parentNode.parentNode.remove()
    }else if(e.target.className == 'btn-success'){
      updateLike(e.target.parentNode.parentNode.id)
      e.target.lastChild.innerText = parseInt(e.target.lastChild.innerText) + 1   
    }else if(e.target.className == 'btn-primary'){
      if(e.target.parentNode.parentNode.querySelector('#edit-quote-form').style.display == 'none'){
        e.target.parentNode.parentNode.querySelector('#edit-quote-form').style.display = ''
      }else{
        e.target.parentNode.parentNode.querySelector('#edit-quote-form').style.display = 'none'
      }
    }
  })

  document.addEventListener('submit', e => {
    e.preventDefault()
    if(e.target.id == 'new-quote-form'){
      addNewFormQuote()
    }else if(e.target.id == 'edit-quote-form'){
      e.target.parentNode.querySelector('#edit-quote-form').style.display = 'none'
      editFormQuote(e.target.parentNode, e.target.parentNode.querySelector('#edit-quote-form'))
    }
  })

  function addNewFormQuote() {
    const form = document.querySelector('#new-quote-form')
    const options = {
      quote: form.quote.value,
      author: form.author.value,
      likes: []
    }
    form.reset()
    createQuote(options)
  }

  function editFormQuote(quoteLi, editForm) {
    quoteLi.querySelector('p').innerText = editForm.quote.value
    quoteLi.querySelector('footer').innerText = editForm.author.value

    const options = {
      quote: editForm.quote.value,
      author: editForm.author.value,
    }
    updateQuote(quoteLi.id, options)
  }

  fetchQuotes()
})