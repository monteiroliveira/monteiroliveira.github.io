let repos = []
let countRepos = 0
const perPage = 5

const getProfile = async () => {
    await fetch("https://api.github.com/users/monteiroliveira", {cache: "default"})
        .then(response => response.json())
        .then(profile => {
            countRepos = profile.public_repos;
        })
        .catch(error => {
            console.error("fail the get how many repos the profile have");
            console.error(error);
        });
}

const loadRepos = async () => {
    let page = 1
    do {
        const url = `https://api.github.com/users/monteiroliveira/repos?per_page=100&page=${page}`
        const fetched = await fetch(url, {cache: "default"})
              .then((resp) => resp.json())
              .catch(error => {
                  document.getElementById('repo-list').innerHTML = '<p>Failed to load repositories.</p>';
                  console.error(error);
              });
        repos = repos.concat(fetched);
        page++;
    } while (page < (countRepos / 100));
}

let page = 1
const buildReposElement = async () => {
    if (repos.length === 0) {
        await getProfile();
        await loadRepos();
    }

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const list = buildRepoElementBody(repos.slice(start, end))
    document.getElementById('repo-list').innerHTML = `<hr>${list}`;
}
buildReposElement();

function buildRepoElementBody(repos) {
    return repos.map(repo =>
        `
<div class="outline-2">
    <h2>${repo.name}</h2>
    <p>
        <a href="${repo.html_url}">Link to the repo</a>
    </p>
    <ul class="org-ul">
        <li>
            description: ${repo.description}
        </li>
    </ul>
    Stars: ${repo.stargazers_count}
</div>
<br><hr>
`
    ).join('');
}

document.getElementById('nextPage').addEventListener('click', function() {
    if (page <= (countRepos - perPage)) {
        page++;
        buildReposElement();
    }
});

document.getElementById('previousPage').addEventListener('click', function() {
    if (page > 1) {
        page--;
        buildReposElement();
    }
});

document.getElementById('searchBox').addEventListener('input', function() {
    var query = this.value.toLowerCase();

    if (query == "") {
        buildReposElement();
    } else {
        const filtered = repos.filter(repo =>
            repo.name.toLowerCase().includes(query)
        )

        const list = buildRepoElementBody(filtered)

        document.getElementById('repo-list').innerHTML = `<hr>${list}`;
    }
});
