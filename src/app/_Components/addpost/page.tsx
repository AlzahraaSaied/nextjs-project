import { addPost } from '@/lib/postsSlice';
import { TextareaAutosize } from '@mui/base';
import { Box, Button,  Typography } from '@mui/material';
import createTypography from '@mui/material/styles/createTypography';
import Link from 'next/link';
import { useDispatch } from 'react-redux';

export default function AddPost(){
    const dispatch = useDispatch<any>();

    function handleSubmit(e:Event){
        e.preventDefault();
        console.log(e.target.body.value);
        console.log(e.target.image.files[0]);
        
        let body= e.target.body.value;
        let image = e.target.image.files[0];
        let formData=new FormData();
        formData.append('body',body);
        formData.append('image',image);
        dispatch(addPost(formData));
       
        
        
    }
    return(<>

    <form style={{ width: "80%", margin: "10px auto" }} onSubmit={handleSubmit}>
    
        <Typography variant="h5" gutterBottom>Create a New Post</Typography>
        <TextareaAutosize name='body'
          style={{ width: "100%",  padding: 10, fontSize: 16, borderRadius:"5"}}
          minRows={6}
          maxRows={10}
          placeholder="What's on your mind?"
        />
        <input className='btn' name='image' type="file"/>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ marginTop: 10 }}
      >
        Post
      </Button>
      <Link href="/posts" passHref>
        <Button variant="contained" color="primary" style={{ marginTop: 20 }}>
          View Your Timeline
        </Button>
      </Link>
    </Box>
       


    </form>

    </>)
}