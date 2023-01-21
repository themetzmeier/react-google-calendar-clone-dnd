Available Commands

### `npm run start`

Here is the video of the problem:

https://videos.ctfassets.net/3evcwiqy7vzh/5StwLmP9bf9qT6NspQbF7T/369210eba5b066ee3c3c0233aa3de1de/2023-01-20_22-30-36.mkv

The summary is when a drag and drop is executed the mouse is not correctly hovering over the event object, however the drop zone is correctly identified as where the object is dropped, not where the mouse is located. This is because of a conflict with the fixed/absolute position styling and the react-beatiful-dnd transform. I have tried all the internet solutions I can find including portals and nothing has worked, any help would be appreciated.