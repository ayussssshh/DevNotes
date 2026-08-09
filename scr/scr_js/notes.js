import "./../scr_css/notes.css"
import { data_api, page_api } from "./apis"
import { notify } from "./notification"



const all_notes = document.getElementById("all_notes");
const main_contant = document.getElementById("main_contant");
const note_editor = document.getElementById("note_editor");
const close_editor = document.getElementById("close_editor");
const save_btn = document.getElementById("savebtn");
const main_contant_container = document.getElementById("main_content_container")
const logout_btn = document.getElementById("logout_btn")
const new_note_btn = document.getElementById("new_note_btn")
const note_menu = document.getElementById("note_menu")
const note_menu_close_btn = document.getElementById("close_note_menu")
const delete_note_btn = document.getElementById("delete_note")
const dom_title = document.getElementById("dom_title")
const all_notes_btn = document.getElementById("all_notes_btn")
const archive_note_btn = document.getElementById("archive")
const trash_note_btn = document.getElementById("trash")
const move_to_trash_btn = document.getElementById("trash_note")
const move_to_pinned_note_btn = document.getElementById("pin_note")
const move_to_fav_note_btn = document.getElementById("fav_note")
const move_to_archive_note_btn = document.getElementById("archive_note")
const search_title_input = document.getElementById("search-input")
const close_search_bar_btn = document.getElementById("clear-search")
const add_tag_container = document.getElementById("add_tag_container")
const close_add_tag_container_btn = document.getElementById("close_add_tag_container")
const add_tag_input = document.getElementById("add_tag_input")
const add_tag_btn = document.getElementById("add_tag_btn")
const add_tag_note_menu_btn = document.getElementById("add_tag")
const remove_tag_note_menu_btn = document.getElementById("remove_tag")
const remove_tag_container = document.getElementById("remove_tag_container")




let opened_note_in_editor_ID = null // it store the data that editor is opeing which note by storing the note id

let opened_note_menu_ID = null  // it store the data that note menu is opend by which note by storing the note id

let current_site_view = 'all'






// this is for creating html elemnt and use them globlely 

const remove_tag_header = document.createElement('h3')
remove_tag_header.textContent = 'Remove Tags'

const remove_tag_container_close_btn = document.createElement('button')
remove_tag_container_close_btn.textContent = '✕'
remove_tag_container_close_btn.id = 'close_remove_tag_container'





// all note btn event listener

all_notes_btn.addEventListener("click", async () => {

    all_notes_btn.style.backgroundColor = "#bbbbbb"

    archive_note_btn.style.backgroundColor = "#ffffff"

    trash_note_btn.style.backgroundColor = "#ffffff"

    current_site_view = 'all'

    all_notes.innerHTML = ""

    await Promise.all([
        create_pinned_notes(),
        create_all_notes(current_site_view)
    ])

})

if (current_site_view = 'all') {

    all_notes_btn.style.backgroundColor = "#bbbbbb"

    await Promise.all([
        create_pinned_notes(),
        create_all_notes(current_site_view)
    ])
}




// event listner for see archive note btn

archive_note_btn.addEventListener('click', async () => {

    archive_note_btn.style.backgroundColor = "#bbbbbb"

    all_notes_btn.style.backgroundColor = "#ffffff"

    trash_note_btn.style.backgroundColor = "#ffffff"

    all_notes.innerHTML = ""

    current_site_view = 'archive'

    await create_all_notes(current_site_view)


})



// event listner for see trash note btn


trash_note_btn.addEventListener('click', async () => {

    archive_note_btn.style.backgroundColor = "#ffffff"

    all_notes_btn.style.backgroundColor = "#ffffff"

    trash_note_btn.style.backgroundColor = "#bbbbbb"

    all_notes.innerHTML = ""

    current_site_view = 'trash'

    await create_all_notes(current_site_view)

})








// api for fecthing the pinned note from server 


async function get_pinned_note() {

    try {

        const response = await data_api.get('/notes/get_pinned_notes')

        return response.data

    } catch (error) {

        if (error.status == 401) {
            notify(error.response.data.message, "error")
        }
    }

}

// api for feching the note data from the server for first time

async function get_all_notes(get_note_query) {
    try {

        const response = await data_api.get('/notes/get_notes', {
            params: {
                note: get_note_query
            }
        }
        )

        return response.data

    } catch (error) {
        if (error.status == 401) {
            notify(error.response.data.message, "error")
        }
    }
}


// api for feching the notes from server while scrolling

async function scrolling_get_notes(last_note_id) {

    try {

        const response = await data_api.get('/notes/scrolling_get_notes', {
            params: {
                last_note_id: last_note_id
            }
        })

        return response.data

    } catch (error) {
        if (error.status == 401) {
            notify(error.response.data.message, "error")
        }
    }

}




// api for feching one note data from server

async function get_one_note(note_id) {

    try {

        const response = await data_api.get('/notes/get_one_note', {
            params: {
                note_id: note_id
            }
        })

        return response.data

    } catch (error) {
        if (error.status == 401) {
            notify(error.response.data.message, "error")
        }
        if (error.status == 401) {
            notify(error.response.data.message, "error")
        }
    }

}




// api for saving the note in db

async function save_note() {

    const editor = document.getElementById('note_inputs')

    const title_input = editor.querySelector('#title')

    const subject_input = editor.querySelector('#subject')

    const note_main_contant_input = editor.querySelector('#notes_main_contant')

    const title = title_input.value

    const subject = subject_input.value

    const note_main_contant = note_main_contant_input.value

    try {

        const response = await data_api.patch('/notes/save-note', {
            note_id: null,
            title: title,
            subject: subject,
            note_main_contant: note_main_contant
        })

        if (response.data.success) {
            notify("Note saved!", "success")
        }

    } catch (error) {
        if (error.status == 401) {
            notify(error.response.data.message, "error")
        }
    }

}




// api for setting the attribute to note like is pinned or archive or trash

async function set_note_attri(note_id, attri, status) {

    try {

        const response = await data_api.post('/notes/set_attri',
            {
                note_id: note_id,
                attri: attri,
                status: status
            }
        )

        return response

    } catch (error) {
        console.log('error')
    }

}




//api for searching the note in db

async function search_title() {

    try {

        const response = await data_api.get('/notes/search', {
            params: {
                q: search_title_input.value
            }
        })

        return response.data.search_result

    } catch (error) {
        console.log(error)
    }

}




// api for the adding the tags

async function add_tag_api(note_id, tag_name) {

    try {

        const response = await data_api.patch('/notes/add-tag', {
            note_id: note_id,
            tag_name: tag_name
        })

        return response.data.massage

    } catch (error) {
        console.log(error)
    }

}





// api for removing the tags in db

async function remove_tag_api(tag_name, note_id) {

    try {

        const response = await data_api.delete(`/notes/delete-tags/${note_id}/${tag_name}`)

        return response.data.massage

    } catch (error) {
        console.log(error)
    }

}



// function for debounce

function debounce(fnc, event_listner_target, frequncy) {

    let timeout;

    event_listner_target.addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fnc();
        }, frequncy)
    });
}




// function for deleteing the note from DOM

function deletenote(note_id) {

    const note = document.getElementById(note_id)

    note.remove()

}



// function for filling the text content for remove tag spans

function fill_remove_tag_span() {

    const note = document.getElementById(opened_note_menu_ID)

    const tags = note.querySelectorAll('.notes_tags')

    const remove_tag_span = document.querySelectorAll('.remove_tag_name')

    remove_tag_span[0].textContent = tags[0].textContent
    remove_tag_span[1].textContent = tags[1].textContent
    remove_tag_span[2].textContent = tags[2].textContent

}




// function for handiling remove tags btn


function handle_remove_tags_btn() {

    const note = document.getElementById(opened_note_menu_ID)

    const tags = note.querySelectorAll('.notes_tags')

    const remove_tag_btn = document.querySelectorAll('.remove_tag_btn')

    remove_tag_btn.forEach((btn, index) => {

        btn.addEventListener('click', () => {

            console.log(tags[index])

        })

    })

}





// function for handiling the position of the open menu

async function handile_menu_position(rect) {

    const viewport_width = window.innerWidth
    const viewport_height = window.innerHeight

    const menu = note_menu

    const menu_rect = menu.getBoundingClientRect()

    const menu_width = menu_rect.width
    const menu_height = menu_rect.height

    // finding the failing case

    // failing in width will never a case

    if (innerHeight < (rect.bottom + menu_height)) {

        const failing_margin = (rect.bottom + menu_height) - innerHeight

        const y_location = rect.bottom - failing_margin

        return y_location

    } else {
        return rect.bottom
    }

}




//way to create pinned note

async function create_pinned_notes() {

    const all_notes_fragment = document.createDocumentFragment();

    const notes = await get_pinned_note()

    console.log(notes)

    notes.forEach((element) => {
        const note_div = document.createElement("div")
        const note_actions = document.createElement("div")
        const pinIcon = document.createElement("span")
        const favIcon = document.createElement("span")
        const note_menu_btn = document.createElement("button")
        const tag_container = document.createElement("div")
        const subject = document.createElement("h6")
        const title = document.createElement("h4")
        const content = document.createElement("p")
        const date = document.createElement("p")

        note_menu_btn.className = "note_menu_btn";
        note_actions.className = "note_actions";
        pinIcon.className = "pin_icon"
        favIcon.className = "fav_icon"
        tag_container.className = "tag_container"
        note_div.className = "notes"
        note_div.id = element.note_id
        subject.className = "notes_subject"
        content.className = "notes_content"
        title.className = "notes_title"

        element.tags.forEach((element_of_tags) => {

            const tags = document.createElement("span")

            tags.className = "notes_tags"

            tags.textContent = element_of_tags;

            tag_container.append(tags);

        })


        favIcon.textContent = "❤️"
        pinIcon.textContent = "📌"
        note_menu_btn.textContent = "⋮"
        title.textContent = element.title
        content.textContent = element.content
        subject.textContent = element.subject
        date.textContent = element.created_date

        favIcon.style.display = element.favorite ? "inline-flex" : "none"

        note_actions.append(pinIcon, favIcon, note_menu_btn)


        note_div.append(note_actions, title, subject, content, tag_container, date);
        all_notes_fragment.appendChild(note_div)

        note_div.addEventListener("click", () => {
            main_contant.style.display = "none"
            note_editor.style.display = "flex"
        })

        note_menu_btn.addEventListener("click", async (e) => {

            e.stopPropagation();

            opened_note_menu_ID = event.target.closest(".notes").id

            const note = notes.find(note => note.note_id === opened_note_menu_ID)

            const is_fav = note.favorite
            const is_archive = note.archived
            const is_trash = note.trashed

            await handile_note_menu(true, is_fav, is_archive, is_trash)

            const button = e.target;

            note_menu.style.display = "flex"

            const rect = button.getBoundingClientRect();

            const y_location = await handile_menu_position(rect)

            note_menu.style.left = rect.left - 150 + "px";
            note_menu.style.top = y_location + "px";

            main_contant_container.style.overflowY = "hidden"

        });

    });

    all_notes.appendChild(all_notes_fragment);

}


// way to create all notes 


async function create_all_notes(get_note_query) {

    const all_notes_fragment = document.createDocumentFragment();

    const notes = await get_all_notes(get_note_query)

    console.log(notes)

    notes.forEach((element) => {
        const note_div = document.createElement("div")
        const note_actions = document.createElement("div")
        const pinIcon = document.createElement("span")
        const favIcon = document.createElement("span")
        const note_menu_btn = document.createElement("button")
        const tag_container = document.createElement("div")
        const subject = document.createElement("h6")
        const title = document.createElement("h4")
        const content = document.createElement("p")
        const date = document.createElement("p")

        note_menu_btn.className = "note_menu_btn";
        note_actions.className = "note_actions";
        pinIcon.className = "pin_icon"
        favIcon.className = "fav_icon"
        tag_container.className = "tag_container"
        note_div.className = "notes"
        note_div.id = element.note_id
        subject.className = "notes_subject"
        content.className = "notes_content"
        title.className = "notes_title"

        element.tags.forEach((element_of_tags) => {

            const tags = document.createElement("span")

            tags.className = "notes_tags"

            tags.textContent = element_of_tags;

            tag_container.append(tags);

        })


        favIcon.textContent = "❤️"
        note_menu_btn.textContent = "⋮"
        title.textContent = element.title
        content.textContent = element.content
        subject.textContent = element.subject
        date.textContent = element.created_date

        favIcon.style.display = element.favorite ? "inline-flex" : "none"

        note_actions.append(pinIcon, favIcon, note_menu_btn)


        note_div.append(note_actions, title, subject, content, tag_container, date);
        all_notes_fragment.appendChild(note_div)

        note_div.addEventListener("click", () => {
            main_contant.style.display = "none"
            note_editor.style.display = "flex"
        })

        note_menu_btn.addEventListener("click", async (e) => {

            e.stopPropagation();

            opened_note_menu_ID = event.target.closest(".notes").id

            const note = notes.find(note => note.note_id === opened_note_menu_ID)

            const is_fav = note.favorite
            const is_archive = note.archived
            const is_trash = note.trashed

            await handile_note_menu(null, is_fav, is_archive, is_trash)


            const button = e.target;

            note_menu.style.display = "flex"

            const rect = button.getBoundingClientRect();

            const y_location = await handile_menu_position(rect)

            note_menu.style.left = rect.left - 150 + "px";
            note_menu.style.top = y_location + "px";

            main_contant_container.style.overflowY = "hidden"

        });

    });

    all_notes.appendChild(all_notes_fragment);

}




// way to create all notes while scrolling


async function create_all_notes_scrolling(last_note_element_id) {

    const all_notes_fragment = document.createDocumentFragment();

    const notes = await scrolling_get_notes(last_note_element_id)

    console.log(notes)

    notes.forEach((element) => {
        const note_div = document.createElement("div")
        const note_actions = document.createElement("div")
        const pinIcon = document.createElement("span")
        const favIcon = document.createElement("span")
        const note_menu_btn = document.createElement("button")
        const tag_container = document.createElement("div")
        const subject = document.createElement("h6")
        const title = document.createElement("h4")
        const content = document.createElement("p")
        const date = document.createElement("p")

        note_menu_btn.className = "note_menu_btn";
        note_actions.className = "note_actions";
        pinIcon.className = "pin_icon"
        favIcon.className = "fav_icon"
        tag_container.className = "tag_container"
        note_div.className = "notes"
        note_div.id = element.note_id
        subject.className = "notes_subject"
        content.className = "notes_content"
        title.className = "notes_title"

        element.tags.forEach((element_of_tags) => {

            const tags = document.createElement("span")

            tags.className = "notes_tags"

            tags.textContent = element_of_tags;

            tag_container.append(tags);

        })



        favIcon.textContent = "❤️"
        note_menu_btn.textContent = "⋮"
        title.textContent = element.title
        content.textContent = element.content
        subject.textContent = element.subject
        date.textContent = element.created_date


        favIcon.style.display = element.favorite ? "inline-flex" : "none"

        note_actions.append(pinIcon, favIcon, note_menu_btn)



        note_div.append(note_actions, title, subject, content, tag_container, date);
        all_notes_fragment.appendChild(note_div)

        note_div.addEventListener("click", () => {
            main_contant.style.display = "none"
            note_editor.style.display = "flex"
        })

        note_menu_btn.addEventListener("click", async (e) => {

            e.stopPropagation();

            opened_note_menu_ID = event.target.closest(".notes").id

            const note = notes.find(note => note.note_id === opened_note_menu_ID)

            const is_fav = note.favorite
            const is_archive = note.archived
            const is_trash = note.trashed

            await handile_note_menu(null, is_fav, is_archive, is_trash)

            const button = e.target;

            note_menu.style.display = "flex"

            const rect = button.getBoundingClientRect();

            await handile_menu_position(rect)

            note_menu.style.left = rect.left - 150 + "px";
            note_menu.style.top = rect.bottom + "px";

            main_contant_container.style.overflowY = "hidden"

        });

    });

    all_notes.appendChild(all_notes_fragment);

}




// way to crate only one note

async function create_one_note(note_id) {

    const note = document.getElementById(note_id)

    note.remove()

    try {

        console.log(note_id)

        const note_data = await get_one_note(note_id)

        note_data.forEach((element) => {
            const note_div = document.createElement("div")
            const note_actions = document.createElement("div")
            const pinIcon = document.createElement("span")
            const favIcon = document.createElement("span")
            const note_menu_btn = document.createElement("button")
            const tag_container = document.createElement("div")
            const subject = document.createElement("h6")
            const title = document.createElement("h4")
            const content = document.createElement("p")
            const date = document.createElement("p")


            note_menu_btn.className = "note_menu_btn";
            note_actions.className = "note_actions";
            pinIcon.className = "pin_icon"
            favIcon.className = "fav_icon"
            tag_container.className = "tag_container"
            note_div.className = "notes"
            note_div.id = note_id
            subject.className = "notes_subject"
            content.className = "notes_content"
            title.className = "notes_title"

            element.tags.forEach((element_of_tags) => {

                const tags = document.createElement("span")

                tags.className = "notes_tags"

                tags.textContent = element_of_tags;

                tag_container.append(tags);

            })



            favIcon.textContent = "❤️"
            note_menu_btn.textContent = "⋮"
            title.textContent = element.title
            content.textContent = element.content
            subject.textContent = element.subject
            date.textContent = element.created_date

            favIcon.style.display = element.favorite ? "inline-flex" : "none"

            note_actions.append(pinIcon, favIcon, note_menu_btn)


            note_div.append(note_actions, title, subject, content, tag_container, date);
            all_notes.prepend(note_div)

            note_div.addEventListener("click", () => {
                main_contant.style.display = "none"
                note_editor.style.display = "flex"
            })

            note_menu_btn.addEventListener("click", async (e) => {

                e.stopPropagation();

                opened_note_menu_ID = event.target.closest(".notes").id

                const note = notes.find(note => note.note_id === opened_note_menu_ID)

                const is_fav = note.favorite
                const is_archive = note.archived
                const is_trash = note.trashed
                const is_pinned = note.pinned

                await handile_note_menu(is_pinned, is_fav, is_archive, is_trash)

                const button = e.target;

                note_menu.style.display = "flex"

                const rect = button.getBoundingClientRect();

                note_menu.style.left = rect.left - 150 + "px";
                note_menu.style.top = rect.bottom + "px";

            });

        });


    } catch (error) {
        console.log(error)
    }

}




// handle the open note menu

function handile_note_menu(is_pinned, is_fav, is_archive, is_trash) {

    move_to_pinned_note_btn.textContent = is_pinned ? "Unpin note" : "Pin note"
    move_to_fav_note_btn.textContent = is_fav ? "Remove from favorites" : "Add to favorites"
    move_to_archive_note_btn.textContent = is_archive ? "Restore from archive" : "Archive note"
    move_to_trash_btn.textContent = is_trash ? "Restore note" : "Move to trash"

}






//  function for selecting the notes id and change the url as /id

function change_url_as_notId() {

    const note = event.target.closest(".notes");

    if (!note) return;

    const clicked_note_id = note.id;

    //console.log(clicked_note_id);

    history.pushState(
        {},
        "",
        `/${clicked_note_id}`
    )

}

// function for the changeing the url back to normal

function change_url_as_normal() {
    history.pushState(
        {},
        "",
        "/"
    )
}





// function for open notes data in editor

function fill_editor(note_id) {

    const note = document.getElementById(note_id)

    const editor = document.getElementById('note_inputs')

    const title = editor.querySelector('#title')

    const subject = editor.querySelector('#subject')

    const note_main_contant = editor.querySelector('#notes_main_contant')

    title.value = note.querySelector('.notes_title').textContent

    subject.value = note.querySelector('.notes_subject').textContent

    note_main_contant.value = note.querySelector('.notes_content').textContent

    dom_title.textContent = note.querySelector('.notes_title').textContent

}


// function for updating the note/save in db

async function update_note(note_id) {

    const editor = document.getElementById('note_inputs')

    const title = editor.querySelector('#title')

    const subject = editor.querySelector('#subject')

    const note_main_contant = editor.querySelector('#notes_main_contant')

    console.log(title.value)

    try {

        const response = await data_api.patch('/notes/save-note', {
            note_id: note_id,
            title: title.value,
            subject: subject.value,
            note_main_contant: note_main_contant.value
        })

        if (response.data.success) {
            notify("Note saved!", "success")
        }

    } catch (error) {

        if (error.status == 401) {
            notify(error.response.data.message, "error")
        }
        if (error.status == 404) {
            notify(error.response.data.message, "error")
        }

    }

}



// function for handling the loading of more notes


let loading = false;

main_contant_container.addEventListener("scroll", async () => {

    if (current_site_view !== 'all') return

    if (loading) return;

    const shouldLoad =
        main_contant_container.scrollTop +
        main_contant_container.clientHeight >=
        main_contant_container.scrollHeight - 200;

    if (!shouldLoad) return;

    loading = true;

    try {
        const lastNoteId = all_notes.lastElementChild.id;

        console.log(lastNoteId)

        await create_all_notes_scrolling(lastNoteId);

    } finally {
        loading = false;
    }
})






// logout funtion

async function logout() {

    try {

        const response = await data_api.delete('/logout/logout')

        if (response.data.logout_status == 'true') {
            window.location.href = '/'
        }

    } catch (error) {
        if (error.status == 401) {
            notify(error.response.data.message, "error")
        }
        if (error.status == 404) {
            notify(error.response.data.message, "error")
        }
    }

}

logout_btn.addEventListener('click', logout)




// open note in editor


all_notes.addEventListener("click", (event) => {

    const note = event.target.closest(".notes");

    if (!note) return;

    const clicked_note_id = note.id;

    opened_note_in_editor_ID = note.id

    fill_editor(clicked_note_id)

})




// open editor for creating new note

new_note_btn.addEventListener('click', () => {

    const editor = document.getElementById('note_inputs')

    const title = editor.querySelector('#title')

    const subject = editor.querySelector('#subject')

    const note_main_contant = editor.querySelector('#notes_main_contant')

    title.value = ''

    subject.value = ''

    note_main_contant.value = ''

    main_contant.style.display = "none"
    note_editor.style.display = "flex"

})





// closing the editor


close_editor.addEventListener("click", async () => {

    if (!opened_note_in_editor_ID) {

        main_contant.style.display = "grid"
        note_editor.style.display = "none"
        opened_note_in_editor_ID = null

    }

    if (opened_note_in_editor_ID) {

        main_contant.style.display = "grid"
        note_editor.style.display = "none"
        dom_title.textContent = "DevNotes"
        await create_one_note(opened_note_in_editor_ID)
        opened_note_in_editor_ID = null

    }

})








// changing the url of open note

all_notes.addEventListener("click", change_url_as_notId)

// changing the url to normal

close_editor.addEventListener("click", change_url_as_normal)


//saving the edited note in db

save_btn.addEventListener("click", async () => {

    if (opened_note_in_editor_ID !== null) {

        await update_note(opened_note_in_editor_ID)

    }

    if (opened_note_in_editor_ID == null) {

        await save_note()

    }

})


// button of closing the opend note menu

note_menu_close_btn.addEventListener('click', () => {

    note_menu.style.display = "none"

    main_contant_container.style.overflowY = "scroll"

    opened_note_menu_ID = null
})


// delete button event listner

delete_note_btn.addEventListener('click', async () => {

    try {

        const response = await data_api.delete(`/notes/delete-note/${opened_note_menu_ID}`)

        if (response.data.massage == 'success') {

            deletenote(opened_note_menu_ID)

            note_menu.style.display = "none"
            opened_note_menu_ID = null

            notify("Note permanently deleted", 'success')

        }

    } catch (error) {

        if (error.status == 401) {
            notify(error.response.data.message, "error")
        }
        if (error.status == 404) {
            notify(error.response.data.message, "error")
        }

    }

})



// set trash note btn event listener

move_to_trash_btn.addEventListener('click', async () => {

    const status = move_to_trash_btn.textContent === "Move to trash" ? true : false

    try {

        const response = await set_note_attri(opened_note_menu_ID, 'trash', status) // the convection is to set a attri 'attri_name' + 'attri_status' attri status can be true or false

        if (response.data.massage == 'success') {
            if (status) {
                notify("Note moved to trash", 'success')
            }
            if (!status) {
                notify("Note restored", 'success')
            }
            deletenote(opened_note_menu_ID)
        }

    } catch (error) {
        if (error.status == 401) {
            notify(error.response.data.message, "error")
        }
        if (error.status == 404) {
            notify(error.response.data.message, "error")
        }
    }

})


// set archive note btn event listener

move_to_archive_note_btn.addEventListener('click', async () => {

    const status = move_to_archive_note_btn.textContent === "Archive note" ? true : false

    try {

        const response = await set_note_attri(opened_note_menu_ID, 'archive', status)

        if (response.data.massage == 'success') {
            if (status) {
                notify("Note archived", 'success')
            }
            if (!status) {
                notify("Note removed from archive", 'success')
            }
            deletenote(opened_note_menu_ID)
        }
    } catch (error) {
        if (error.status == 401) {
            notify(error.response.data.message, "error")
        }
        if (error.status == 404) {
            notify(error.response.data.message, "error")
        }
    }

})


// set fav note btn event listener

move_to_fav_note_btn.addEventListener('click', async () => {

    const status = move_to_fav_note_btn.textContent === "Add to favorites" ? true : false

    try {

        const response = await set_note_attri(opened_note_menu_ID, 'fav', status)

        if (response.data.massage == 'success') {
            if (status) {
                notify("Added to favorites", 'success')
            }
            if (!status) {
                notify("Removed from favorites", 'success')
            }
        }

    } catch (error) {
        if (error.status == 401) {
            notify(error.response.data.message, "error")
        }
        if (error.status == 404) {
            notify(error.response.data.message, "error")
        }
    }

})


// set pinned note btn event listener

move_to_pinned_note_btn.addEventListener('click', async () => {

    const status = move_to_fav_note_btn.textContent === "Pin note" ? true : false

    try {

        await set_note_attri(opened_note_menu_ID, 'pinned', status)

    } catch (error) {
        console.log(error)
    }

})




// doing the search in server using the help of debounce function

debounce(create_searched_note, search_title_input, 3000)



// event listner logic for the close search bar button


close_search_bar_btn.addEventListener('click', async () => {

    all_notes.innerHTML = ""

    search_title_input.value = ''

    current_site_view = 'all'

    all_notes_btn.style.backgroundColor = "#afafaf"

    await create_pinned_notes()

    await create_all_notes()

    console.log('close_search_bar_btn is working')

})



// handling the search bar and create note card on each recived data

async function create_searched_note() {

    current_site_view = 'search_mode'

    const search_note_data = await search_title()

    all_notes.innerHTML = ""

    const all_notes_fragment = document.createDocumentFragment();

    console.log(search_note_data)

    search_note_data.forEach((element) => {
        const note_div = document.createElement("div")
        const note_actions = document.createElement("div")
        const pinIcon = document.createElement("span")
        const favIcon = document.createElement("span")
        const note_menu_btn = document.createElement("button")
        const tag_container = document.createElement("div")
        const subject = document.createElement("h6")
        const title = document.createElement("h4")
        const content = document.createElement("p")
        const date = document.createElement("p")

        note_menu_btn.className = "note_menu_btn";
        note_actions.className = "note_actions";
        pinIcon.className = "pin_icon"
        favIcon.className = "fav_icon"
        tag_container.className = "tag_container"
        note_div.className = "notes"
        note_div.id = element.note_id
        subject.className = "notes_subject"
        content.className = "notes_content"
        title.className = "notes_title"

        element.tags.forEach((element_of_tags) => {

            const tags = document.createElement("span")

            tags.className = "notes_tags"

            tags.textContent = element_of_tags;

            tag_container.append(tags);

        })


        favIcon.textContent = "❤️"
        note_menu_btn.textContent = "⋮"
        title.textContent = element.title
        content.textContent = element.content
        subject.textContent = element.subject
        date.textContent = element.created_date

        favIcon.style.display = element.favorite ? "inline-flex" : "none"

        note_actions.append(pinIcon, favIcon, note_menu_btn)


        note_div.append(note_actions, title, subject, content, tag_container, date);
        all_notes_fragment.appendChild(note_div)

        note_div.addEventListener("click", () => {
            main_contant.style.display = "none"
            note_editor.style.display = "flex"
        })

        note_menu_btn.addEventListener("click", (e) => {

            e.stopPropagation();

            opened_note_menu_ID = event.target.closest(".notes").id

            console.log(opened_note_menu_ID)

            const button = e.target;

            note_menu.style.display = "flex"

            const rect = button.getBoundingClientRect();

            note_menu.style.left = rect.left - 150 + "px";
            note_menu.style.top = rect.bottom + "px";

        });

    });

    all_notes.appendChild(all_notes_fragment);

}




// event listner for add tag note menu btn

add_tag_note_menu_btn.addEventListener('click', (e) => {

    add_tag_input.value = ''

    e.stopPropagation();

    const button = e.target;

    add_tag_container.style.display = 'flex'

    const rect = button.getBoundingClientRect();

    add_tag_container.style.left = rect.left - 150 + "px";
    add_tag_container.style.top = rect.bottom + "px";

})



// event listner for the closing the add tag container


close_add_tag_container_btn.addEventListener('click', () => {

    add_tag_container.style.display = 'none'

})


// event listner for the add tag btn

add_tag_btn.addEventListener('click', async () => {

    const note = document.getElementById(opened_note_menu_ID)

    const tag_name = add_tag_input.value

    const response = await add_tag_api(opened_note_menu_ID, tag_name)

    if (response == 'success') {

        const tag_container = note.querySelector('.tag_container')

        const new_tag = document.createElement("span")

        new_tag.textContent = tag_name

        new_tag.className = 'notes_tags'

        tag_container.append(new_tag)

    } else {
        // code for showing the error massge
        // like a notification toast
    }

})





// event listner for the removetag note menu btn 

remove_tag_note_menu_btn.addEventListener('click', (e) => {

    remove_tag_container.innerHTML = ''

    remove_tag_container.append(remove_tag_header, remove_tag_container_close_btn)



    const note = document.getElementById(opened_note_menu_ID)

    const tags = note.querySelectorAll('.notes_tags')

    if (tags.length === 0) {
        console.log('add tags first')
        // error noticetion alert for adding tags first!!
        return
    }

    tags.forEach((coloumn) => {

        const remove_tag_coloumn_container = document.createElement('div')
        const remove_tag_span = document.createElement('span')
        const remove_tag_coloumn_btn = document.createElement('button')

        remove_tag_coloumn_container.className = 'each_tag_remove_container'
        remove_tag_span.className = 'remove_tag_name'
        remove_tag_coloumn_btn.className = 'remove_tag_btn'

        remove_tag_coloumn_btn.textContent = '✕'

        remove_tag_coloumn_btn.addEventListener('click', async (event) => {

            const parent_container = event.target.parentElement

            const span = parent_container.querySelector('.remove_tag_name')

            const response = await remove_tag_api(span.textContent, opened_note_menu_ID)

            parent_container.remove()

            await create_one_note(opened_note_menu_ID)

        })

        remove_tag_coloumn_container.append(remove_tag_span, remove_tag_coloumn_btn)

        remove_tag_container.append(remove_tag_coloumn_container)

    })

    e.stopPropagation();

    const button = e.target;

    remove_tag_container.style.display = 'flex'

    const rect = button.getBoundingClientRect();

    remove_tag_container.style.left = rect.left - 150 + "px";
    remove_tag_container.style.top = rect.bottom - 100 + "px";

    handle_remove_tags_btn()
    fill_remove_tag_span()

})




// event listner for the closing the remove tag container 



remove_tag_container_close_btn.addEventListener('click', () => {

    remove_tag_container.style.display = 'none'

    const remove_tag_span = document.querySelectorAll('.remove_tag_name')

    remove_tag_span[0].textContent = ''
    remove_tag_span[1].textContent = ''
    remove_tag_span[2].textContent = ''
})



