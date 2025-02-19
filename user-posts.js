document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    
    if (userId) {
        fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
            .then(response => response.json())
            .then(user => {
                document.getElementById("user-name").textContent = user.name;
            })
            .catch(error => console.error("Error fetching user details:", error));
        
        fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
            .then(response => response.json())
            .then(posts => {
                const postsList = document.getElementById("posts-list");
                
                if (posts.length === 0) {
                    postsList.innerHTML = "<p>ไม่มีโพสต์สำหรับผู้ใช้นี้</p>";
                    return;
                }
                
                posts.forEach(post => {
                    const postItem = document.createElement("div");
                    postItem.classList.add("post-item");
                    postItem.setAttribute("data-post-id", post.id);
                    postItem.innerHTML = `
                        <h3>${post.title}</h3>
                        <p>${post.body}</p>
                        <button class="comment-btn" onclick="toggleComments(${post.id}, this)">ดูความคิดเห็น</button>
                    `;
                    postsList.appendChild(postItem);
                });
            })
            .catch(error => console.error("Error fetching posts:", error));
    }
});

function toggleComments(postId, button) {
    const postItem = document.querySelector(`.post-item[data-post-id="${postId}"]`);
    const existingCommentSection = postItem.querySelector(".comments-list");

    if (existingCommentSection) {
        existingCommentSection.remove();
        button.textContent = "ดูความคิดเห็น";
    } else {
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        .then(response => response.json())
        .then(comments => {
            const commentSection = document.createElement("div");
            commentSection.classList.add("comments-list");

            commentSection.innerHTML = "<hr>";

            if (comments.length === 0) {
                commentSection.innerHTML = "<p>ยังไม่มีความคิดเห็น</p>";
            } else {
                comments.forEach(comment => {
                    const commentItem = document.createElement("div");
                    commentItem.classList.add("comment-item");
                    commentItem.innerHTML = `
                        <p><strong>${comment.email}</strong><br> ${comment.body}</p>
                    `;
                    commentSection.appendChild(commentItem);
                });
            }

            postItem.appendChild(commentSection);
            button.textContent = "ซ่อนความคิดเห็น";
        })
    .catch(error => console.error("Error fetching comments:", error));
    }
}