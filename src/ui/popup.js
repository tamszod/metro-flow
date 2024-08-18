
import { forwardRef, useEffect, useRef, useState } from 'react';
import './popup.css';

export const PopUp = forwardRef((
    {
        // Values
        style, // Support for style property
        open, // Default state of pop-up
        title, // Name of the window
        draggable, // Sets the window draggability
        // Events
        onClose, // Event triggered when closing the pop-up. If not given the pop-window will not display a close button.
        children // Child component
    },
    dialog
) => {
    const [position, setPosition] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        if (!draggable){
            return;
        }
        setIsDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
        if (!draggable){
            return
        }
        if (isDragging) {
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            setPosition(prevPosition => ({
                marginTop: prevPosition.marginTop + dy,
                marginLeft: prevPosition.marginLeft + dx
            }));
            dragStart.current = { x: e.clientX, y: e.clientY };
        }
      };
    
      const handleMouseUp = () => {
        if (!draggable){
            return;
        }
        setIsDragging(false);
      };

    useEffect(() => {
        if (!draggable){
            return;
        }
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        };
      }, [isDragging]);

    useEffect(() => {
        if (!draggable){
            return;
        }
        if (dialog?.current){
            const rect = dialog.current.getBoundingClientRect();
            setPosition({ marginTop: window.innerHeight/2-(rect.height/2), marginLeft: window.innerWidth/2-(rect.width/2)});
            dialog.current.classList.remove("ui__popup_position__middle")
        }
    }, [draggable, dialog, setPosition]);

    return (
        <dialog 
            ref={dialog}
            style={{
                ...style,
                ...position,
            }}
            className='ui__popup_hidden ui__popup ui__popup_position__middle' 
            open={open}
            >
            <nav
                className='ui__popup__header'
                onMouseDown={handleMouseDown}
            >
                <span
                    className='ui__popup__header__title'
                >
                    {title}
                </span>
                {
                    onClose ?
                    <button 
                        className='ui__popup__header__close'
                        onClick={event => onClose(event)}>
                        <span>&times;</span>
                    </button>
                    :
                    <></>
                }
            </nav>
        {children}
    </dialog>)
})