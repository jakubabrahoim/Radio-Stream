interface Props {
    country: Object
}

function Home(props: Props) {
    return (
        <>
            <h1>Home page</h1>
            <p>Hello, you are from {props.country.city}, {props.country.country}</p>
        </>
    )
}

export default Home;