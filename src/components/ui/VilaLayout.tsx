import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"
import { Header } from "../organism/Header"
import logo from './../../../public/logo.svg'
import { VilaButton } from "./VilaButton";
import { useSnackbar } from "../../hooks/useSnackbar";
import { VilaIcon } from "./VilaIcon";
import { Tutorial } from "../organism/Tutorial";
import { useMisc } from "../../hooks/useMisc";

export function VilaLayout({ title, children, isPublic, fillScreen }: { title?: string, children: JSX.Element | JSX.Element[], isPublic?: boolean, fillScreen?: boolean }) {


    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const snackbar = useSnackbar()
    const { visibleTutorial, setVisibleTutorial } = useMisc()

    return (

        (isPublic || user) ?
            <div className={`min-h-full flex  flex-col items-center h-full md:h-auto md:min-h-full w-full px-4 py-4 
                ${isPublic && 'flex h-screen backdrop-blur-sm items-center justify-center bg-[url("/front-vertical-min.jpg")] md:bg-[url("/front-image-min.jpg")] bg-cover '} `}>
                {!isPublic ?
                    <>
                        <Header />
                        <main className={`w-full flex max-w-[1500px] h-full ${fillScreen && '!h-[calc(100vh-182px)] '}  bg-transparent py-5 2xl:py-16 md:px-4 relative`}>
                            {title ? <h1 className='text-2xl text-primary-500'>{title}</h1> : undefined}
                            {children}
                        </main>
                        <footer className=" mt-10 2xl:mt-16 max-w-[1500px] text-highlight text-sm w-full bottom-0 h-[50px] flex justify-between items-center py-2">
                            <VilaButton font="lightFont" onClick={()=>setVisibleTutorial(true)} buttonStyle="outlined" icon="help" >{'Tutorial'}</VilaButton>
                            <div className="flex gap-2"><VilaIcon className="text-2xl" type="developer" /><span>{'Created by David Vila'}</span></div>
                        </footer>
                        {(!user?.tutorialCompleted || visibleTutorial) && <Tutorial />}
                    </>
                    :
                    <main className="flex max-w-[1500px] h-full overflow-auto w-full max-h-[900px] ml-auto mr-auto">
                        {children}
                    </main>
                }
            </div>
            :
            <div className={`min-h-full flex  flex-col items-center md:min-h-full h-screen backdrop-blur-sm w-full px-4 py-4 bg-[url("/front-vertical-min.jpg")] 
            md:bg-[url("/front-image-min.jpg")] bg-cover '} `}>
                <main className={`flex backdrop-brightness-[20%] backdrop-blur-sm p-8 rounded-lg h-full md:h-auto justify-center items-center py flex-col gap-6 m-auto`}>
                    <img src={logo} className='w-[120px] h-[120px]' alt='Logo login' />
                    <p className="text-lightFont-500">{'You need an account to view this page'}</p>
                    <VilaButton onClick={() => navigate("/login")} font="lightFont">{'Login'}</VilaButton>
                </main>
            </div>
    )
}
