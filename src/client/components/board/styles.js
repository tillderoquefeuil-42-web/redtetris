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
    width: ${props => props.width ? props.width*0.4 : "20"}px;
    height: ${props => props.width ? props.width*0.4 : "40"}px;
    position: absolute;
    left: ${props => props.position ? props.position.x : "0"}px;
    top: ${props => props.position ? props.position.y : "0"}px;
    transform: rotate(${props => props.position ? props.position.r : "0"}deg);
    display: flex;
    flex-wrap: wrap;
`;


export const Block = styled.div`
    width: ${props => props.size ? props.size-1 : "9"}px;
    height: ${props => props.size ? props.size-1 : "9"}px;
    border: 0.5px solid #000;

    background: ${props => props.plain? props.color : "none"};
        
`;