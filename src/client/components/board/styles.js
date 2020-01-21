import styled from 'styled-components';
import { devices } from '../../devices/devices.js';

export const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
`;

export const Column = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`;


// width: ${props => props.width ? props.width : "100"}px;
// height: ${props => props.width ? 2*props.width : "200"}px;
export const BoardWrapper = styled.div`

    width: 100px;
    height: 200px;
    border: 1px solid #000;
    position: relative;
    display: flex;
    flex-wrap: wrap;

    @media ${devices.mobileS}, @media ${devices.mobileM}, @media ${devices.mobileL} {
        width: 200px;
        height: 400px;
    }

    @media ${devices.tablet}, @media ${devices.laptop}, @media ${devices.laptopL} {
        width: 300px;
        height: 600px;
    }

    @media ${devices.desktop}, @media ${devices.desktopL} {
        width: 600px;
        height: 1200px;
    }
`;

export const NextPieceWrapper = styled.div`

    width: 100px;
    height: 40px;
    display: flex;
    flex-wrap: wrap;

    @media ${devices.mobileS}, @media ${devices.mobileM}, @media ${devices.mobileL} {
        width: 200px;
        height: 80px;
    }

    @media ${devices.tablet}, @media ${devices.laptop}, @media ${devices.laptopL} {
        width: 300px;
        height: 120px;
    }

    @media ${devices.desktop}, @media ${devices.desktopL} {
        width: 600px;
        height: 240px;
    }
`;

export const Block = styled.div`

    width: ${props => props.demo? '10' : '9.8'}px;
    height: ${props => props.demo? '10' : '9.8'}px;
    border: ${props => props.demo? 'none' : '0.1px solid #000'};
    background: ${props => props.plain? props.color : "none"};
    
    @media ${devices.mobileS}, @media ${devices.mobileM}, @media ${devices.mobileL} {
        border: ${props => props.demo? 'none' : '0.5px solid #000'};
        width: ${props => props.demo? '20' : '19'}px;
        height: ${props => props.demo? '20' : '19'}px;
    }

    @media ${devices.tablet}, @media ${devices.laptop}, @media ${devices.laptopL} {
        width: ${props => props.demo? '30' : '29'}px;
        height: ${props => props.demo? '30' : '29'}px;
    }

    @media ${devices.desktop}, @media ${devices.desktopL} {
        width: ${props => props.demo? '60' : '59'}px;
        height: ${props => props.demo? '60' : '59'}px;
    }
`;