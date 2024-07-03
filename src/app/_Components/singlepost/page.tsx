import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost, deletePost, updateComment, deleteComment, addComment } from '@/lib/postsSlice';
import { RootState } from '@/lib/store';
import { useState, useEffect } from 'react'; // Correcting this line

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface PostDetails {
  _id: string;
  body: string;
  image: string;
  user: {
    _id: string;
    photo: string;
    name: string;
  };
  comments: Array<{
    _id: string;
    body: string;
    commentCreator: {
      photo: string;
      name: string;
    };
  }>;
  createdAt: string;
}

interface SinglePostProps {
  postdetails: PostDetails;
}

export default function SinglePost({ postdetails }: SinglePostProps) {
  const dispatch = useDispatch<any>();
  const [postDetails, setPostDetails] = useState(postdetails);
  const [expanded, setExpanded] = useState(false);
  const [editingPost, setEditingPost] = useState<boolean>(false);
  const [updatedPostBody, setUpdatedPostBody] = useState<string>(postdetails.body);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [updatedCommentBody, setUpdatedCommentBody] = useState<string>('');
  const [newCommentBody, setNewCommentBody] = useState<string>('');
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [updatedPostImage, setUpdatedPostImage] = useState(postDetails.image);

  // Add logging to verify values
  console.log("currentUser:", currentUser);
  console.log("postDetails:", postDetails);

  const handleAddComment = () => {
    dispatch(addComment({ postId: postDetails._id, body: newCommentBody })).then((action: any) => {
      if (action.meta.requestStatus === 'fulfilled') {
        setPostDetails({
          ...postDetails,
          comments: [...postDetails.comments, action.payload],
        });
        setNewCommentBody('');
      }
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePost = () => {
    if (postDetails.user && postDetails.user._id !== currentUser?.id) {
      const updatedPost = { id: postDetails._id, body: updatedPostBody, image: updatedPostImage };
      dispatch(updatePost(updatedPost)).then((action: any) => {
        if (action.meta.requestStatus === 'fulfilled') {
          setPostDetails({ ...postDetails, body: updatedPostBody, image: updatedPostImage });
          setEditingPost(false);
          localStorage.setItem(`post_${postDetails._id}`, JSON.stringify({ ...postDetails, body: updatedPostBody, image: updatedPostImage }));
        }
      });
    } else {
      console.error('You can only update your own posts.');
    }
  };

  const handleDeletePost = () => {
    dispatch(deletePost(postDetails._id)).then((action: any) => {
      if (action.meta.requestStatus === 'fulfilled') {
        setPostDetails(null);
      } else {
        console.error('Failed to delete post:', action.error);
      }
    });
  };

  const handleUpdateComment = (commentId: string) => {
    dispatch(updateComment({ id: commentId, body: updatedCommentBody })).then((action: any) => {
      if (action.meta.requestStatus === 'fulfilled') {
        setPostDetails({
          ...postDetails,
          comments: postDetails.comments.map((comment) => {
            if (comment._id === commentId) {
              return { ...comment, body: updatedCommentBody };
            }
            return comment;
          }),
        });
        setEditingComment(null);
      }
    });
  };

  const handleDeleteComment = (commentId: string) => {
    dispatch(deleteComment(commentId)).then((action: any) => {
      if (action.meta.requestStatus === 'fulfilled') {
        setPostDetails({
          ...postDetails,
          comments: postDetails.comments.filter((comment) => comment._id !== commentId),
        });
      }
    });
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    setPostDetails(postdetails);
    const storedPostDetails = localStorage.getItem(`post_${postdetails._id}`);
    if (storedPostDetails) {
      setPostDetails(JSON.parse(storedPostDetails));
    }
  }, [postdetails]);

  return (
    <Card sx={{ maxWidth: 345, marginTop: 5 }}>
      <CardHeader
        avatar={<Avatar src={postdetails.user.photo} sx={{ bgcolor: red[500] }} aria-label="recipe" />}
        action={<IconButton aria-label="settings"><MoreVertIcon /></IconButton>}
        title={postdetails.user.name}
        subheader={postDetails.createdAt}
      />
      {editingPost ? (
        <>
          <TextField
            fullWidth
            variant="outlined"
            label="Edit post"
            multiline
            rows={4}
            value={updatedPostBody}
            onChange={(e) => setUpdatedPostBody(e.target.value)}
          />
          <input
            accept="image/*"
            type="file"
            onChange={handleImageUpload}
          />
          {updatedPostImage && (
            <img src={updatedPostImage} alt="Uploaded" height="194" />
          )}
          <Button onClick={handleUpdatePost}>Save</Button>
        </>
      ) : (
        <>
          <CardMedia
            component="img"
            height="194"
            image={postDetails.image}
            alt="Post Image"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {postDetails.body}
            </Typography>
          </CardContent>
          <Button onClick={() => setEditingPost(true)}>Edit</Button>
        </>
      )}
      <CardActions disableSpacing>
        <IconButton aria-label="Delete Post" onClick={handleDeletePost}>
          <DeleteIcon />
        </IconButton>
        {currentUser && postDetails.user && postDetails.user._id === currentUser.id && (
          <IconButton aria-label="Edit Post" onClick={() => setEditingPost(true)}>
            <EditIcon />
          </IconButton>
        )}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {postDetails.comments.map((comment) => (
            <Box key={comment._id} className="comment">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar src={comment.commentCreator?.photo} sx={{ bgcolor: red[500], marginRight: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {comment.commentCreator?.name}
                </Typography>
                <Typography paragraph sx={{ paddingTop: 10 }}>
                  {comment?.content}
                </Typography>
              </Box>
              {editingComment === comment._id ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Edit comment"
                  multiline
                  rows={2}
                  defaultValue={comment.body}
                  onChange={(e) => setUpdatedCommentBody(e.target.value)}
                />
              ) : (
                <Typography paragraph sx={{ marginTop: 1 }}>
                  {comment.body}
                </Typography>
              )}
              {editingComment === comment._id ? (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateComment(comment._id)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setEditingComment(null)}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setEditingComment(comment._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Box>
          ))}
          <TextField
            fullWidth
            variant="outlined"
            label="Add a comment"
            multiline
            rows={2}
            value={newCommentBody}
            onChange={(e) => setNewCommentBody(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddComment}
          >
            Add Comment
          </Button>
        </CardContent>
      </Collapse>
    </Card>
  );
}
