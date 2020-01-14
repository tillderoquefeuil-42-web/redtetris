import styled from 'styled-components';

export const Wrapper = styled.div`
    width: ${props => props.width ? props.width : "100"}px;
    height: ${props => props.width ? 2*props.width : "200"}px;
    border: 1px solid #000;
    position: relative;
    display: flex;
    flex-wrap: wrap;
`;

export const PieceWrapper = styled.div`
    width: ${props => props.width ? props.width*0.2 : "20"}px;
    height: ${props => props.width ? props.width*0.4 : "40"}px;
    position: absolute;
    left: ${props => props.position ? props.position.x : "0"}px;
    top: ${props => props.position ? props.position.y : "0"}px;
    display: flex;
    flex-wrap: wrap;
    transform: rotate(${props => props.position ? props.position.rotate : "0"}deg);
`;


export const Square = styled.div`
    width: ${props => props.size ? props.size-1 : "9"}px;
    height: ${props => props.size ? props.size-1 : "9"}px;
    background: ${props => props.bg && props.piece ? "palevioletred" : "none"};
        
    border: 0.5px solid #000;
    ${props => props.piece ? 
    "border: 0.5px solid #fff;" : ""}
    ${props => !props.bg && props.piece ? 
    "border: none;" : ""}
`;