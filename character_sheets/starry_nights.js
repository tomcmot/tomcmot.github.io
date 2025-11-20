import { html } from 'htm/preact'
import { useEffect, useReducer, useState } from 'preact/hooks'
import {Header, HeartContainer, Characters, ToolBar} from './components.js'

const storedCharacters = JSON.parse(localStorage.getItem('starry_night_characters'))
const initialCharacters = storedCharacters === null ? {characters: [], character: {hearts: {current: 3, maximum: 3}}} : storedCharacters
function reducer(state, action) {
    switch(action?.type) {
        case 'sync':
            return action.value
        case 'loseHeart':
            return {
                ...state,
                character: {
                    ...state.character,
                    hearts: {
                        current: state.character.hearts.current - 1,
                        maximum: state.character.hearts.maximum - 1
                    }
                }
            }
        case 'gainHeart':
            return {
                ...state,
                character: {
                    ...state.character,
                    hearts: {
                        current: state.character.hearts.current + 1,
                        maximum: state.character.hearts.maximum + 1
                    }
                }
            }
        case 'save':
            localStorage.setItem('starry_night_characters', JSON.stringify(state))
            return state
        case 'create':
            if (state.character.name) {
                console.log('saving new character')
                const now = new Date()
                state.character.id = state.character.name + now
                localStorage.setItem('starry_night_characters', JSON.stringify(state))
            }
            return {...state}
        case 'editName':
            return {
                ...state,
                character: {
                    ...state.character,
                    name: action.value
                }
            }
        default:
            return state

    }
}

export function App() {
    const [characters, dispatch] = useReducer(reducer, initialCharacters)
    const updateStorage = event => {
        if (event.key === 'starry_night_characters') {
            dispatch({type:'sync', value: event.newValue})
        }
    }
    useEffect(() => {
        window.addEventListener('storage', updateStorage)
        return () => window.removeEventListener('storage', updateStorage)
    }, [characters])

    return html`
    <${Characters.Provider} value=${{characters, dispatch}}>
        <${ToolBar} />
        <${Header} />
        <${HeartContainer} />
    <//>
    `;

}
