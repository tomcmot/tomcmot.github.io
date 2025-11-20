import { html } from 'htm/preact'
import {createContext } from 'preact'
import { useContext, useState} from 'preact/hooks'

export const Characters = createContext()

function Heart({full}) {
    const solid = html`<i class="fa-solid fa-heart heart -full" />`
    const regular = html`<i class="fa-regular fa-heart heart -empty" />`

    return full ? solid : regular
}

export function HeartContainer({}) {
    const {characters, dispatch} = useContext(Characters)
    const {character: {hearts:{current, maximum}}} = characters
    const heart = (_, i) =>
        html`
            <${Heart}
                key=${i}
                full=${i < Math.min(current, maximum) ? true : false}
            />`
    const hearts = Array.from({length:maximum}, heart)

    return html`
        <div class="heart-container">
            ${hearts}
            <div class="modifiers">
                <button onClick=${() => { dispatch({type: 'loseHeart'}) }}><i class="fa-solid fa-heart-circle-minus" /><//>
                <button onClick=${() => { dispatch({type: 'gainHeart'}) }}><i class="fa-solid fa-heart-circle-plus" /><//>
            </div>
        </div>`

}

export function ToolBar({}) {
    const {characters: {character}, dispatch} = useContext(Characters)
    if (character.id) {
        return html`
            <div class="tool-bar">
                <button onClick=${() => {dispatch({type: 'save'})}}><i class="fa-solid fa-user-pen"/><//>
            </div>
        `
    }
    return html`
        <div class="tool-bar">
            <button onClick=${() => {dispatch({type: 'create'})}}><i class="fa-solid fa-user-plus"/><//>
        </div>
    `
}

export function Header({}) {
    const {characters: {character}, dispatch} = useContext(Characters)
    const [edit, setEdit] = useState(!character.name)
    return html`
        <div class="header">
            <input class="name ${edit ? '-edit' : '-display'}" readonly=${!edit} onChange=${e => dispatch({type: 'editName', value: e.target.value})} value=${character.name ?? ''} />
            <span class="dummy">${character.name}<//>
            <button class="lock" onClick=${() => setEdit(!edit)}><i class="fa-solid ${edit ? 'fa-lock' : 'fa-lock-open'}" /><//>
        </div>
    `
}
