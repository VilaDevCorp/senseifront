import headerImg from './../../../public/logo.svg';
import { HeaderUser } from '../molecule/HeaderUser';
import { TopMenu } from '../molecule/TopMenu';
import { useScreen } from '../../hooks//useScreen';
import { MenuOption, VilaSidebar } from '../ui/VilaSidebar';
import { VilaButtonIcon } from '../ui/VilaButtonIcon';
import { useMisc } from '../../hooks/useMisc';


const navigationItems: MenuOption[] = [
    { label: 'Planner', route: '/' },
    { label: 'Activities', route: '/activities' },
    { label: 'Templates', route: '/templates' },
    { label: 'Stats', route: '/stats' }
];

export function Header() {
    const { screenWidth } = useScreen()
    const { setOpenSidebar, setBlockedSidebar, blockedSidebar } = useMisc()

    const onOpenSidebar = () => {
        if (!blockedSidebar) {
            setBlockedSidebar(true)
            setOpenSidebar(true)
        }
    }

    return (
        <header className='flex w-full h-[100px] items-center max-w-[1400px] ml-auto mr-auto 2xl:mt-4'>
            {screenWidth <= 800 &&
                <VilaButtonIcon icon='menu' buttonStyle='transparent' onClick={() => onOpenSidebar()} />
            }
            {screenWidth >= 800 &&
                <img src={headerImg} alt='Logo header' className='cursor-pointer ml-2 h-[60px] w-[70px] ' />
            }

            {screenWidth > 800 ?
                <TopMenu options={navigationItems} />
                :
                <VilaSidebar options={navigationItems} />
            }
            <HeaderUser />
        </header>
    )
}