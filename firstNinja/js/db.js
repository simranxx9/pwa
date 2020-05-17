// offline data indexedDB
db.enablePersistence()
.then(()=>console.log(' persistence made !'))
    .catch(err=>{
        if(err.code == 'failed-precondition')
        {
            console.log('failed persistence');
        }
        else if(err.code == 'unimplemented')
        {
            console.log('persistence is not available');
        }
    })




// realtime listener
db.collection('recipes').onSnapshot(snapshot=>{
    snapshot.docChanges().forEach(change=>{
        
        console.log(change);
        // add document data
        if(change.type === 'added')
        {
            renderRecipes(change.doc.data(),change.doc.id);
        }
        if(change.type === 'removed')
        {
            removeRecipe(change.doc.id);
        }

    })
})

const form = document.querySelector('form');
form.addEventListener('submit',(evt)=>{
    evt.preventDefault();
    console.log('adding processed');

    const recipe = {
        title:form.title.value,
        ingridients: form.ingridients.value
    }
    db.collection('recipes').add(recipe).then(()=>console.log('added successfully'))
        .catch(err=>console.log(err));

    form.title.value = '';
    form.ingridients.value = '';
})

const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', evt => {
  if(evt.target.tagName === 'I'){
    const id = evt.target.getAttribute("data-id");
    console.log(id);
    db.collection('recipes').doc(id).delete();
  }
})