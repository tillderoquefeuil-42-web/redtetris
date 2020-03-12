import styled from 'styled-components';
import { devices } from '../../devices/devices.js';

export const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
`;

export const Wrapper = styled.div`

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding: 50px;
    padding: 20px 50px;
    color: #fff;

    box-shadow: #000000bd 0px 0px 50px -10px inset;
    background: #832424;
    border: 10px solid #c51b12;
    border-radius: 10px;

    min-width: 120px;

    @media ${devices.mobileS}, @media ${devices.mobileM}, @media ${devices.mobileL} {
        min-width: 220px;
    }

    @media ${devices.tablet}, @media ${devices.laptop}, @media ${devices.laptopL} {
        min-width: 320px;
    }
    
    @media ${devices.desktop}, @media ${devices.desktopL} {
        min-width: 620px;
    }
`;

export const Span = styled.span`
    cursor: pointer;

    :hover, :active {
        text-decoration: underline;
    }
`;