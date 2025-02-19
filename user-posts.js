document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");

    if (userId) {
        fetchUserDetails(userId);
        fetchUserPosts(userId);
    }
});

function fetchUserDetails(userId) {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById("user-name").textContent = user.name;
        })
        .catch(error => console.error("Error fetching user details:", error));
}

function fetchUserPosts(userId) {
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        .then(response => response.json())
        .then(posts => {
            const postsList = document.getElementById("posts-list");
            postsList.innerHTML = ""; // เคลียร์โพสต์เก่าก่อนโหลดใหม่

            if (posts.length === 0) {
                postsList.innerHTML = "<p>ไม่มีโพสต์สำหรับผู้ใช้นี้</p>";
                return;
            }

            posts.forEach(post => {
                const postItem = document.createElement("div");
                postItem.classList.add("post-item");
                postItem.dataset.postId = post.id;

                const title = document.createElement("h3");
                title.textContent = post.title;

                const body = document.createElement("p");
                body.textContent = post.body;

                const commentButton = document.createElement("button");
                commentButton.classList.add("comment-btn");
                commentButton.textContent = "ดูความคิดเห็น";
                commentButton.addEventListener("click", () => toggleComments(post.id, commentButton));

                postItem.appendChild(title);
                postItem.appendChild(body);
                postItem.appendChild(commentButton);
                postsList.appendChild(postItem);
            });
        })
        .catch(error => console.error("Error fetching posts:", error));
}

function toggleComments(postId, button) {
    const postItem = document.querySelector(`.post-item[data-post-id="${postId}"]`);
    let commentSection = postItem.querySelector(".comments-list");

    if (commentSection) {
        commentSection.classList.toggle("hidden");
        button.textContent = commentSection.classList.contains("hidden") ? "ดูความคิดเห็น" : "ซ่อนความคิดเห็น";
        return;
    }

    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        .then(response => response.json())
        .then(comments => {
            commentSection = document.createElement("div");
            commentSection.classList.add("comments-list");

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
