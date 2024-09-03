import { AiOutlineDelete, AiOutlineDown, AiOutlineEdit, AiOutlineFile, AiOutlineFilePdf, AiOutlineRight, AiOutlineSearch } from 'react-icons/ai';
import { BsCheck, BsMap } from 'react-icons/bs';
import { CgCloseR } from 'react-icons/cg';
import { FiMail } from 'react-icons/fi';
import { FaRedo, FaRegListAlt, FaSignInAlt, FaUserCircle, FaRegStickyNote } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import { RiCoinLine, RiLogoutCircleRLine } from 'react-icons/ri';
import { IoMdAddCircleOutline, IoMdArrowRoundBack, IoMdArrowRoundForward, IoMdPeople, IoMdPhonePortrait, IoIosMenu, IoMdClose, IoIosAdd, IoIosCalendar, IoIosPlay, IoMdHelp } from 'react-icons/io';
import { BiDownload, BiUpload, BiShow, BiHide } from 'react-icons/bi';
import { TbFileAlert } from 'react-icons/tb';
import { ImWarning } from 'react-icons/im';
import { GrInProgress } from 'react-icons/gr';
import { GoCheck } from 'react-icons/go';
import { GiTwoCoins } from 'react-icons/gi';

export type IconType = "previous" | "next" | "logout" | "cancel" | "confirm" | "close" | "user" | "login" |
    "delete" | "edit" | "add" | "check" | "search" | "mail" | "phone" | "download" | "upload" | "alert" |
    "map" | "pdf" | "meeting" | "log" | "file" | "incidence" | "progress" | "important" | "redo" | "menu" |
    "unfold" | "fold" | "coin" | "calendar" | "play" | "developer" | "notes" | "help" | "show" | "hide"

const getIcon = (type: IconType): JSX.Element => {
    switch (type) {
        case "logout":
            return <RiLogoutCircleRLine />
        case "previous":
            return <IoMdArrowRoundBack />
        case "next":
            return <IoMdArrowRoundForward />
        case "cancel":
            return <MdOutlineCancel />
        case "confirm":
            return <BsCheck />
        case "close":
            return <IoMdClose />
        case "user":
            return <FaUserCircle />
        case "login":
            return <FaSignInAlt />
        case "edit":
            return <AiOutlineEdit />
        case "delete":
            return <AiOutlineDelete />
        case "add":
            return <IoIosAdd />
        case "check":
            return <GoCheck />
        case "search":
            return <AiOutlineSearch />
        case "mail":
            return <FiMail />
        case "phone":
            return <IoMdPhonePortrait />
        case "download":
            return <BiDownload />
        case "upload":
            return <BiUpload />
        case "alert":
            return <ImWarning />
        case "map":
            return <BsMap />
        case "pdf":
            return <AiOutlineFilePdf />
        case "meeting":
            return <IoMdPeople />
        case "log":
            return <FaRegListAlt />
        case "file":
            return <AiOutlineFile />
        case "incidence":
            return <TbFileAlert />
        case "progress":
            return <GrInProgress />
        case "redo":
            return <FaRedo />
        case "menu":
            return <IoIosMenu />
        case "fold":
            return <AiOutlineRight />
        case "unfold":
            return <AiOutlineDown />
        case "coin":
            return <GiTwoCoins />
        case "calendar":
            return <IoIosCalendar />
        case "play":
            return <IoIosPlay />
        case "developer":
            return <svg width="1em" height="1em" stroke='currentColor' fill='currentColor' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M877.685565 727.913127l-0.584863-0.365539a32.898541 32.898541 0 0 1-8.041866-46.423497 411.816631 
                411.816631 0 1 0-141.829267 145.777092c14.621574-8.992268 33.62962-5.117551 43.645398 8.772944l0.146216 0.073108a30.412874 
                30.412874 0 0 1-7.968758 43.206751l-6.141061 4.020933a475.201154 475.201154 0 1 1 163.615412-164.419599 29.974227 29.974227 
                0 0 1-42.841211 9.357807z m-537.342843-398.584106c7.164571-7.091463 24.71046-9.650239 33.26408 0 10.600641 11.185504 7.164571 
                29.462472 0 37.138798l-110.612207 107.468569L370.901811 576.14119c7.164571 7.091463 8.114974 27.342343 0 35.384209-9.796455 
                9.723347-29.828011 8.188081-36.480827 1.535265L208.309909 487.388236a18.423183 18.423183 0 0 1 0-25.953294l132.032813-132.032813z 
                m343.314556 0l132.032813 132.032813a18.423183 18.423183 0 0 1 0 25.953294L689.652124 613.133772c-6.652816 6.579708-25.587754 
                10.746857-36.553935 0-10.30821-10.235102-7.091463-31.290168 0-38.381632l108.345863-100.669537-111.855041-108.638294c-7.164571-7.676326-9.504023-26.611265
                0-36.04218 9.284699-9.138484 26.903696-7.091463 34.068267 0z m-135.54199-26.318833c3.582286-9.504023 
                21.347498-15.498868 32.679217-11.258612 10.819965 4.020933 17.180349 19.008046 14.256035 28.512069l-119.896906 329.716493c-3.509178 
                9.504023-20.616419 13.305632-30.193551 9.723347-10.161994-3.509178-21.201282-17.545889-17.545888-26.976804l120.627985-329.716493z" /></svg>
        case "notes":
            return <FaRegStickyNote />
        case "help":
            return <IoMdHelp />
        case "show":
            return <BiShow />
        case "hide":
            return <BiHide />
        default:
            return <></>
    }
}

type Props = {
    type: IconType
} & React.ComponentPropsWithoutRef<'span'>

export function VilaIcon(props: Props) {
    const { type, className, ...nativeProps } = props
    return (
        <span className={`flex justify-center items-center ${className}`} {...nativeProps} >
            {getIcon(props.type)}
        </span>
    )
}